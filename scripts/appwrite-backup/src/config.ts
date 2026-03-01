import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", ".env"),
  path.resolve(process.cwd(), "..", "..", ".env"),
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
}

export interface RetrySettings {
  maxRetries: number;
  baseDelayMs: number;
}

export interface RuntimeConfig {
  appwriteEndpoint: string;
  appwriteProjectId: string;
  appwriteApiKey: string;
  appwriteDatabaseId: string;
  outputDir: string;
  pageLimit: number;
  retry: RetrySettings;
  driveParentFolderId: string;
  driveBackupsRootName: string;
  driveRetentionCount: number;
  googleOAuthClientId: string;
  googleOAuthClientSecret: string;
  driveScopes: string[];
  gdriveTokensPath: string;
}

export interface CliOverrides {
  databaseId?: string;
  outputDir?: string;
  pageLimit?: number;
  retentionCount?: number;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getNumberEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Invalid number for ${name}: ${raw}`);
  }
  return value;
}

function getOptionalEnv(name: string, fallback = ""): string {
  return process.env[name]?.trim() || fallback;
}

export function loadConfig(overrides: CliOverrides = {}): RuntimeConfig {
  const outputDir = overrides.outputDir ?? process.env.OUTPUT_DIR ?? "backups";
  const scopesRaw =
    process.env.GDRIVE_SCOPES?.trim() || "https://www.googleapis.com/auth/drive";

  return {
    appwriteEndpoint: getRequiredEnv("APPWRITE_ENDPOINT"),
    appwriteProjectId: getRequiredEnv("APPWRITE_PROJECT_ID"),
    appwriteApiKey: getRequiredEnv("APPWRITE_API_KEY"),
    appwriteDatabaseId:
      overrides.databaseId ?? getRequiredEnv("APPWRITE_DATABASE_ID"),
    outputDir: path.resolve(process.cwd(), outputDir),
    pageLimit: overrides.pageLimit ?? getNumberEnv("PAGE_LIMIT", 100),
    retry: {
      maxRetries: getNumberEnv("MAX_RETRIES", 5),
      baseDelayMs: getNumberEnv("RETRY_BASE_DELAY_MS", 500),
    },
    driveParentFolderId: getOptionalEnv("GDRIVE_PARENT_FOLDER_ID"),
    driveBackupsRootName: getOptionalEnv("GDRIVE_BACKUPS_ROOT_NAME", "AppwriteBackups"),
    driveRetentionCount:
      overrides.retentionCount ?? getNumberEnv("GDRIVE_RETENTION_COUNT", 14),
    googleOAuthClientId: getOptionalEnv("GOOGLE_OAUTH_CLIENT_ID"),
    googleOAuthClientSecret: getOptionalEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
    driveScopes: scopesRaw
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    gdriveTokensPath: path.resolve(process.cwd(), ".gdrive_tokens.json"),
  };
}

export function loadGoogleOnlyConfig() {
  return {
    googleOAuthClientId: getRequiredEnv("GOOGLE_OAUTH_CLIENT_ID"),
    googleOAuthClientSecret: getRequiredEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
    driveScopes: (
      process.env.GDRIVE_SCOPES?.trim() ||
      "https://www.googleapis.com/auth/drive"
    )
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    gdriveTokensPath: path.resolve(process.cwd(), ".gdrive_tokens.json"),
  };
}
