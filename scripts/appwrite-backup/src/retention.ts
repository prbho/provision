import type { drive_v3 } from "googleapis";
import type { Logger } from "./logger.js";

export interface RetentionDeletedItem {
  fileId: string;
  fileName: string;
  createdTime?: string | null;
  parentId?: string | null;
}

interface DriveFileInfo {
  id: string;
  name: string;
  createdTime?: string | null;
  parents?: string[] | null;
}

async function listFilesInFolder(params: {
  drive: drive_v3.Drive;
  folderId: string;
  namePrefix: string;
}): Promise<DriveFileInfo[]> {
  const files: DriveFileInfo[] = [];
  let pageToken: string | undefined;
  do {
    const res = await params.drive.files.list({
      q: `trashed=false and '${params.folderId}' in parents and mimeType!='application/vnd.google-apps.folder' and name contains '${params.namePrefix}'`,
      fields: "nextPageToken,files(id,name,createdTime,parents)",
      pageSize: 1000,
      pageToken,
      supportsAllDrives: false,
      orderBy: "createdTime desc",
    });
    for (const file of res.data.files ?? []) {
      if (file.id && file.name && file.name.startsWith(params.namePrefix)) {
        files.push({
          id: file.id,
          name: file.name,
          createdTime: file.createdTime,
          parents: file.parents ?? null,
        });
      }
    }
    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);
  return files;
}

async function listDirectChildFolders(params: {
  drive: drive_v3.Drive;
  folderId: string;
}): Promise<string[]> {
  const folders: string[] = [];
  let pageToken: string | undefined;
  do {
    const res = await params.drive.files.list({
      q: `trashed=false and '${params.folderId}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: "nextPageToken,files(id)",
      pageSize: 1000,
      pageToken,
      supportsAllDrives: false,
    });
    for (const folder of res.data.files ?? []) {
      if (folder.id) {
        folders.push(folder.id);
      }
    }
    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);
  return folders;
}

export async function enforceDriveRetention(params: {
  drive: drive_v3.Drive;
  backupsRootFolderId: string;
  retentionCount: number;
  filePrefix: string;
  logger: Logger;
}): Promise<RetentionDeletedItem[]> {
  if (params.retentionCount < 1) {
    throw new Error("Retention count must be at least 1.");
  }

  const foldersToScan = [
    params.backupsRootFolderId,
    ...(await listDirectChildFolders({
      drive: params.drive,
      folderId: params.backupsRootFolderId,
    })),
  ];

  const allFilesNested = await Promise.all(
    foldersToScan.map((folderId) =>
      listFilesInFolder({
        drive: params.drive,
        folderId,
        namePrefix: params.filePrefix,
      }),
    ),
  );
  const allFiles = allFilesNested.flat();
  const unique = new Map<string, DriveFileInfo>();
  for (const file of allFiles) {
    unique.set(file.id, file);
  }

  const sorted = [...unique.values()].sort((a, b) => {
    const aTime = new Date(a.createdTime ?? 0).getTime();
    const bTime = new Date(b.createdTime ?? 0).getTime();
    return bTime - aTime;
  });

  const toDelete = sorted.slice(params.retentionCount);
  const deleted: RetentionDeletedItem[] = [];

  for (const file of toDelete) {
    await params.drive.files.delete({
      fileId: file.id,
      supportsAllDrives: false,
    });
    params.logger.info(
      `Retention deleted Drive file: ${file.name} (${file.id}) created=${file.createdTime ?? "unknown"}`,
    );
    deleted.push({
      fileId: file.id,
      fileName: file.name,
      createdTime: file.createdTime,
      parentId: file.parents?.[0] ?? null,
    });
  }
  return deleted;
}
