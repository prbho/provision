import fs from "node:fs";
import path from "node:path";
import {
  createAppwriteContext,
  fetchDocumentsPage,
  listCollections,
} from "./appwrite.js";
import { loadConfig, type RuntimeConfig } from "./config.js";
import {
  createAuthorizedDrive,
  ensureDriveFolders,
  uploadZipToDrive,
} from "./drive.js";
import { Logger } from "./logger.js";
import { NdjsonWriter } from "./ndjson.js";
import { enforceDriveRetention, type RetentionDeletedItem } from "./retention.js";
import { zipBackupFolder } from "./zip.js";

export interface BackupOptions {
  databaseId?: string;
  outputDir?: string;
  pageLimit?: number;
  collectionId?: string;
  dryRun?: boolean;
  noDrive?: boolean;
  retentionCount?: number;
}

type CollectionStatus = "success" | "failed";

interface CollectionManifest {
  collectionId: string;
  name?: string;
  totalFetched: number;
  pages: number;
  status: CollectionStatus;
  errors: string[];
}

type OverallStatus = "success" | "partial_success" | "failed";

interface DriveUploadManifest {
  enabled: boolean;
  folderPath?: string;
  parentFolderId?: string;
  backupsRootFolderId?: string;
  dateFolderId?: string;
  fileId?: string;
  fileName?: string;
  uploadedAt?: string;
  sizeBytes?: number;
  webViewLink?: string;
  errors?: string[];
}

interface BackupManifest {
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  appwrite: {
    endpoint: string;
    projectId: string;
    databaseId: string;
  };
  pageLimit: number;
  retrySettings: {
    maxRetries: number;
    baseDelayMs: number;
  };
  collections: CollectionManifest[];
  driveUpload: DriveUploadManifest;
  retention: {
    enabled: boolean;
    retentionCount: number;
    deleted: RetentionDeletedItem[];
    errors: string[];
  };
  overallStatus: OverallStatus;
}

export interface BackupResult {
  status: OverallStatus;
}

function nowTimestampParts(date = new Date()) {
  const iso = date.toISOString();
  const datePart = iso.slice(0, 10);
  const timePart = iso.slice(11, 19).replace(/:/g, "-");
  return {
    datePart,
    timestampPart: `${datePart}_${timePart}`,
  };
}

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function writeManifest(filePath: string, manifest: BackupManifest): void {
  fs.writeFileSync(filePath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

function writeManifestSafe(
  filePath: string,
  manifest: BackupManifest,
  logger: Logger,
): void {
  try {
    writeManifest(filePath, manifest);
  } catch (error) {
    logger.error(`Failed to write manifest at ${filePath}: ${formatError(error)}`);
  }
}

function computeOverallStatus(collections: CollectionManifest[]): OverallStatus {
  const succeeded = collections.filter((collection) => collection.status === "success")
    .length;
  if (succeeded === 0) {
    return "failed";
  }
  if (succeeded === collections.length) {
    return "success";
  }
  return "partial_success";
}

async function backupCollection(params: {
  cfg: RuntimeConfig;
  logger: Logger;
  databases: ReturnType<typeof createAppwriteContext>["databases"];
  databaseId: string;
  collectionId: string;
  collectionName?: string;
  collectionFilePath: string;
}): Promise<CollectionManifest> {
  const manifest: CollectionManifest = {
    collectionId: params.collectionId,
    name: params.collectionName,
    totalFetched: 0,
    pages: 0,
    status: "success",
    errors: [],
  };

  const writer = new NdjsonWriter(params.collectionFilePath);
  let cursorAfter: string | undefined;

  try {
    while (true) {
      const page = await fetchDocumentsPage({
        databases: params.databases,
        databaseId: params.databaseId,
        collectionId: params.collectionId,
        pageLimit: params.cfg.pageLimit,
        cursorAfter,
        retry: params.cfg.retry,
        logger: params.logger,
      });
      const docs = page.documents ?? [];
      if (docs.length === 0) {
        break;
      }

      manifest.pages += 1;
      for (const doc of docs) {
        writer.write(doc);
      }
      manifest.totalFetched += docs.length;
      cursorAfter = docs[docs.length - 1]?.$id;

      params.logger.info(
        `Collection ${params.collectionId}: page ${manifest.pages}, fetched ${docs.length} docs (total ${manifest.totalFetched}).`,
      );

      if (docs.length < params.cfg.pageLimit) {
        break;
      }
    }
  } catch (error) {
    manifest.status = "failed";
    manifest.errors.push(formatError(error));
    params.logger.error(
      `Collection ${params.collectionId} failed: ${formatError(error)}`,
    );
  } finally {
    await writer.close();
  }

  return manifest;
}

export async function runBackup(options: BackupOptions): Promise<BackupResult> {
  const cfg = loadConfig({
    databaseId: options.databaseId,
    outputDir: options.outputDir,
    pageLimit: options.pageLimit,
    retentionCount: options.retentionCount,
  });

  const appwrite = createAppwriteContext({
    endpoint: cfg.appwriteEndpoint,
    projectId: cfg.appwriteProjectId,
    apiKey: cfg.appwriteApiKey,
  });
  const logger = new Logger();

  logger.info(`Listing collections for database ${cfg.appwriteDatabaseId}`);
  const allCollections = await listCollections({
    databases: appwrite.databases,
    databaseId: cfg.appwriteDatabaseId,
    retry: cfg.retry,
    logger,
  });
  const selectedCollections = options.collectionId
    ? allCollections.filter((collection) => collection.$id === options.collectionId)
    : allCollections;

  if (selectedCollections.length === 0) {
    throw new Error(
      options.collectionId
        ? `Collection ${options.collectionId} not found in database ${cfg.appwriteDatabaseId}.`
        : `No collections found in database ${cfg.appwriteDatabaseId}.`,
    );
  }

  logger.info(
    `Found ${selectedCollections.length} collection(s): ${selectedCollections.map((c) => c.$id).join(", ")}`,
  );

  if (options.dryRun) {
    logger.info("Dry-run enabled: no files will be written.");
    if (!options.noDrive) {
      await createAuthorizedDrive({
        auth: {
          clientId: cfg.googleOAuthClientId,
          clientSecret: cfg.googleOAuthClientSecret,
          tokensPath: cfg.gdriveTokensPath,
        },
        logger,
      });
      logger.info("Drive credentials validated in dry-run mode.");
    } else {
      logger.info("Drive validation skipped because --no-drive was provided.");
    }
    return { status: "success" };
  }

  const start = new Date();
  const { datePart, timestampPart } = nowTimestampParts(start);
  const backupDir = path.join(cfg.outputDir, timestampPart);
  const collectionsDir = path.join(backupDir, "collections");
  const logsPath = path.join(backupDir, "logs.txt");
  const manifestPath = path.join(backupDir, "manifest.json");
  const zipPath = path.join(backupDir, "backup.zip");
  const driveFileName = `appwrite_backup_${cfg.appwriteProjectId}_${cfg.appwriteDatabaseId}_${timestampPart}.zip`;

  fs.mkdirSync(collectionsDir, { recursive: true });
  const fileLogger = new Logger(logsPath);
  fileLogger.info(`Backup started for database ${cfg.appwriteDatabaseId}`);

  const manifest: BackupManifest = {
    startedAt: start.toISOString(),
    finishedAt: "",
    durationMs: 0,
    appwrite: {
      endpoint: cfg.appwriteEndpoint,
      projectId: cfg.appwriteProjectId,
      databaseId: cfg.appwriteDatabaseId,
    },
    pageLimit: cfg.pageLimit,
    retrySettings: {
      maxRetries: cfg.retry.maxRetries,
      baseDelayMs: cfg.retry.baseDelayMs,
    },
    collections: [],
    driveUpload: {
      enabled: !options.noDrive,
      folderPath: `${cfg.driveBackupsRootName}/${datePart}`,
      parentFolderId: cfg.driveParentFolderId,
      errors: [],
    },
    retention: {
      enabled: !options.noDrive,
      retentionCount: cfg.driveRetentionCount,
      deleted: [],
      errors: [],
    },
    overallStatus: "failed",
  };

  try {
    for (const collection of selectedCollections) {
      const ndjsonPath = path.join(collectionsDir, `${collection.$id}.ndjson`);
      fileLogger.info(
        `Backing up collection ${collection.$id}${collection.name ? ` (${collection.name})` : ""} to ${ndjsonPath}`,
      );
      const collectionResult = await backupCollection({
        cfg,
        logger: fileLogger,
        databases: appwrite.databases,
        databaseId: cfg.appwriteDatabaseId,
        collectionId: collection.$id,
        collectionName: collection.name,
        collectionFilePath: ndjsonPath,
      });
      manifest.collections.push(collectionResult);
      writeManifestSafe(manifestPath, manifest, fileLogger);
    }

    manifest.overallStatus = computeOverallStatus(manifest.collections);
    writeManifestSafe(manifestPath, manifest, fileLogger);

    if (manifest.overallStatus === "failed") {
      fileLogger.error("All collections failed to export. Skipping zip/upload/retention.");
    } else {
      fileLogger.info(`Creating ZIP archive at ${zipPath}`);
      await zipBackupFolder(backupDir, zipPath);
      fileLogger.info(`ZIP archive created: ${zipPath}`);

      if (!options.noDrive) {
        try {
          const drive = await createAuthorizedDrive({
            auth: {
              clientId: cfg.googleOAuthClientId,
              clientSecret: cfg.googleOAuthClientSecret,
              tokensPath: cfg.gdriveTokensPath,
            },
            logger: fileLogger,
          });

          const folders = await ensureDriveFolders({
            drive,
            parentFolderId: cfg.driveParentFolderId,
            backupsRootName: cfg.driveBackupsRootName,
            dateFolderName: datePart,
          });
          manifest.driveUpload.backupsRootFolderId = folders.rootFolderId;
          manifest.driveUpload.dateFolderId = folders.dateFolderId;

          const upload = await uploadZipToDrive({
            drive,
            zipPath,
            driveFolderId: folders.dateFolderId,
            fileName: driveFileName,
          });
          manifest.driveUpload.fileId = upload.fileId;
          manifest.driveUpload.fileName = upload.fileName;
          manifest.driveUpload.uploadedAt = upload.uploadedAt;
          manifest.driveUpload.sizeBytes = upload.sizeBytes;
          manifest.driveUpload.webViewLink = upload.webViewLink;
          writeManifestSafe(manifestPath, manifest, fileLogger);
          fileLogger.info(
            `Uploaded ZIP to Drive: fileId=${upload.fileId}, folderId=${folders.dateFolderId}`,
          );

          try {
            const deleted = await enforceDriveRetention({
              drive,
              backupsRootFolderId: folders.rootFolderId,
              retentionCount: cfg.driveRetentionCount,
              filePrefix: "appwrite_backup_",
              logger: fileLogger,
            });
            manifest.retention.deleted = deleted;
          } catch (error) {
            const msg = `Retention failed: ${formatError(error)}`;
            manifest.retention.errors.push(msg);
            fileLogger.error(msg);
          }
        } catch (error) {
          const msg = `Drive upload failed: ${formatError(error)}`;
          manifest.driveUpload.enabled = true;
          manifest.driveUpload.errors?.push(msg);
          fileLogger.error(msg);
          if (manifest.overallStatus === "success") {
            manifest.overallStatus = "partial_success";
          }
        }
      } else {
        fileLogger.info("Skipping Drive upload because --no-drive was provided.");
        manifest.driveUpload.enabled = false;
        manifest.retention.enabled = false;
      }
    }
  } catch (error) {
    const msg = `Backup failed unexpectedly: ${formatError(error)}`;
    fileLogger.error(msg);
    manifest.driveUpload.errors?.push(msg);
    const hasCollectionSuccess = manifest.collections.some(
      (collection) => collection.status === "success",
    );
    manifest.overallStatus = hasCollectionSuccess ? "partial_success" : "failed";
  } finally {
    const finishedAt = new Date();
    manifest.finishedAt = finishedAt.toISOString();
    manifest.durationMs = finishedAt.getTime() - start.getTime();
    writeManifestSafe(manifestPath, manifest, fileLogger);
    await fileLogger.close();
  }

  logger.info(`Backup completed with status=${manifest.overallStatus}`);
  return { status: manifest.overallStatus };
}
