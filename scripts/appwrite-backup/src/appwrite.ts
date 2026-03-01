import { Client, Databases, Query, type Models } from "node-appwrite";
import type { RetrySettings } from "./config.js";
import type { Logger } from "./logger.js";

export interface AppwriteContext {
  databases: Databases;
  endpoint: string;
  projectId: string;
}

type CollectionDoc = Models.Document & { $id: string };

export function createAppwriteContext(params: {
  endpoint: string;
  projectId: string;
  apiKey: string;
}): AppwriteContext {
  const client = new Client()
    .setEndpoint(params.endpoint)
    .setProject(params.projectId)
    .setKey(params.apiKey);
  return {
    databases: new Databases(client),
    endpoint: params.endpoint,
    projectId: params.projectId,
  };
}

function getHttpStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || !error) {
    return undefined;
  }
  const maybeCode = (error as { code?: unknown }).code;
  if (typeof maybeCode === "number") {
    return maybeCode;
  }
  const maybeResponseStatus = (error as { response?: { status?: unknown } }).response
    ?.status;
  return typeof maybeResponseStatus === "number" ? maybeResponseStatus : undefined;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function isRetryable(error: unknown): boolean {
  const status = getHttpStatus(error);
  if (status === 429) {
    return true;
  }
  if (typeof status === "number" && status >= 500) {
    return true;
  }
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes("ecconnreset") ||
    message.includes("timed out") ||
    message.includes("timeout") ||
    message.includes("network")
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  operationName: string,
  settings: RetrySettings,
  logger: Logger,
  fn: () => Promise<T>,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= settings.maxRetries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const retryable = isRetryable(error);
      const status = getHttpStatus(error);
      const message = getErrorMessage(error);
      if (!retryable || attempt >= settings.maxRetries) {
        throw error;
      }
      const jitter = Math.floor(Math.random() * settings.baseDelayMs);
      const backoffMs = settings.baseDelayMs * Math.pow(2, attempt - 1) + jitter;
      logger.warn(
        `${operationName} failed (attempt ${attempt}/${settings.maxRetries}, status=${status ?? "unknown"}): ${message}. Retrying in ${backoffMs}ms`,
      );
      await delay(backoffMs);
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

export async function listCollections(params: {
  databases: Databases;
  databaseId: string;
  retry: RetrySettings;
  logger: Logger;
}): Promise<Models.Collection[]> {
  const result = await withRetry(
    "listCollections",
    params.retry,
    params.logger,
    () => params.databases.listCollections(params.databaseId),
  );
  return result.collections;
}

export async function fetchDocumentsPage(params: {
  databases: Databases;
  databaseId: string;
  collectionId: string;
  pageLimit: number;
  cursorAfter?: string;
  retry: RetrySettings;
  logger: Logger;
}): Promise<Models.DocumentList<CollectionDoc>> {
  const queries = [
    Query.limit(params.pageLimit),
    Query.orderAsc("$id"),
    ...(params.cursorAfter ? [Query.cursorAfter(params.cursorAfter)] : []),
  ];

  return withRetry(
    `listDocuments(${params.collectionId})`,
    params.retry,
    params.logger,
    async () =>
      (await params.databases.listDocuments(
        params.databaseId,
        params.collectionId,
        queries,
      )) as Models.DocumentList<CollectionDoc>,
  );
}
