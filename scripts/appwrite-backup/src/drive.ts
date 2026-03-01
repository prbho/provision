import fs from "node:fs";
import { google, type drive_v3 } from "googleapis";
import type { Credentials } from "google-auth-library";
import type { Logger } from "./logger.js";

export interface DriveAuthConfig {
  clientId: string;
  clientSecret: string;
  tokensPath: string;
}

export interface DriveUploadResult {
  rootFolderId: string;
  dateFolderId: string;
  fileId: string;
  fileName: string;
  uploadedAt: string;
  sizeBytes: number;
  webViewLink?: string;
}

interface StoredTokens {
  refresh_token?: string | null;
  access_token?: string | null;
  scope?: string | null;
  token_type?: string | null;
  expiry_date?: number | null;
}

export function loadStoredTokens(tokensPath: string): StoredTokens {
  if (!fs.existsSync(tokensPath)) {
    throw new Error(
      `Google Drive token file not found at ${tokensPath}. Run "npm run gdrive:auth" first.`,
    );
  }
  const raw = fs.readFileSync(tokensPath, "utf8");
  const parsed = JSON.parse(raw) as StoredTokens;
  if (!parsed.refresh_token) {
    throw new Error(
      `Token file at ${tokensPath} is missing refresh_token. Run "npm run gdrive:auth" again.`,
    );
  }
  return parsed;
}

export function saveTokens(tokensPath: string, tokens: StoredTokens): void {
  fs.writeFileSync(tokensPath, `${JSON.stringify(tokens, null, 2)}\n`, "utf8");
}

export async function createAuthorizedDrive(params: {
  auth: DriveAuthConfig;
  logger: Logger;
}): Promise<drive_v3.Drive> {
  if (!params.auth.clientId || !params.auth.clientSecret) {
    throw new Error(
      "Missing GOOGLE_OAUTH_CLIENT_ID or GOOGLE_OAUTH_CLIENT_SECRET in .env.",
    );
  }
  const oauth2Client = new google.auth.OAuth2(
    params.auth.clientId,
    params.auth.clientSecret,
  );
  let currentTokens = loadStoredTokens(params.auth.tokensPath);
  oauth2Client.setCredentials({
    refresh_token: currentTokens.refresh_token ?? undefined,
    access_token: currentTokens.access_token ?? undefined,
    scope: currentTokens.scope ?? undefined,
    token_type: currentTokens.token_type ?? undefined,
    expiry_date: currentTokens.expiry_date ?? undefined,
  });
  oauth2Client.on("tokens", (tokens: Credentials) => {
    if (!tokens.access_token && !tokens.refresh_token) {
      return;
    }
    currentTokens = {
      ...currentTokens,
      ...tokens,
      refresh_token: tokens.refresh_token ?? currentTokens.refresh_token,
    };
    saveTokens(params.auth.tokensPath, currentTokens);
  });

  const drive = google.drive({ version: "v3", auth: oauth2Client });
  await drive.about.get({ fields: "user(emailAddress)" });
  params.logger.info("Google Drive authentication validated.");
  return drive;
}

async function findOrCreateFolder(params: {
  drive: drive_v3.Drive;
  name: string;
  parentId: string;
}): Promise<string> {
  const escapedName = params.name.replace(/'/g, "\\'");
  const listRes = await params.drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and trashed=false and name='${escapedName}' and '${params.parentId}' in parents`,
    fields: "files(id,name)",
    pageSize: 1,
    supportsAllDrives: false,
  });
  const existing = listRes.data.files?.[0];
  if (existing?.id) {
    return existing.id;
  }

  const createRes = await params.drive.files.create({
    requestBody: {
      name: params.name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [params.parentId],
    },
    fields: "id",
    supportsAllDrives: false,
  });

  if (!createRes.data.id) {
    throw new Error(`Failed to create folder "${params.name}"`);
  }
  return createRes.data.id;
}

export async function ensureDriveFolders(params: {
  drive: drive_v3.Drive;
  parentFolderId: string;
  backupsRootName: string;
  dateFolderName: string;
}): Promise<{ rootFolderId: string; dateFolderId: string }> {
  if (!params.parentFolderId) {
    throw new Error("Missing GDRIVE_PARENT_FOLDER_ID in .env.");
  }
  const rootFolderId = await findOrCreateFolder({
    drive: params.drive,
    name: params.backupsRootName,
    parentId: params.parentFolderId,
  });
  const dateFolderId = await findOrCreateFolder({
    drive: params.drive,
    name: params.dateFolderName,
    parentId: rootFolderId,
  });
  return { rootFolderId, dateFolderId };
}

export async function uploadZipToDrive(params: {
  drive: drive_v3.Drive;
  zipPath: string;
  driveFolderId: string;
  fileName: string;
}): Promise<DriveUploadResult> {
  const uploadRes = await params.drive.files.create({
    requestBody: {
      name: params.fileName,
      parents: [params.driveFolderId],
    },
    media: {
      mimeType: "application/zip",
      body: fs.createReadStream(params.zipPath),
    },
    fields: "id,name,createdTime,size,webViewLink",
    uploadType: "resumable",
    supportsAllDrives: false,
  });

  if (!uploadRes.data.id || !uploadRes.data.name || !uploadRes.data.createdTime) {
    throw new Error("Drive upload completed but no file metadata was returned.");
  }

  return {
    rootFolderId: "",
    dateFolderId: params.driveFolderId,
    fileId: uploadRes.data.id,
    fileName: uploadRes.data.name,
    uploadedAt: uploadRes.data.createdTime,
    sizeBytes: Number(uploadRes.data.size ?? 0),
    webViewLink: uploadRes.data.webViewLink ?? undefined,
  };
}
