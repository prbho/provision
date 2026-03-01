# Appwrite Cloud Backup Tool

Automated backup for one Appwrite Database:
- Export all documents from all collections to NDJSON (incremental writes, paginated).
- Zip each backup run.
- Upload zip to Google Drive My Drive using OAuth user tokens (not service accounts).
- Enforce retention (keep latest N uploaded zip backups).

## Folder Layout

Output layout (default `backups/`):

```text
backups/
  YYYY-MM-DD_HH-mm-ss/
    manifest.json
    collections/
      <collectionId>.ndjson
    logs.txt
    backup.zip
```

## Prerequisites

- Node.js 20+
- Appwrite Cloud project + API key with read access to the target database/collections/documents
- Google account with access to the target My Drive folder

## Setup

1. Install dependencies:

```bash
cd scripts/appwrite-backup
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Fill `.env`:

```env
APPWRITE_ENDPOINT=
APPWRITE_PROJECT_ID=
APPWRITE_API_KEY=
APPWRITE_DATABASE_ID=
OUTPUT_DIR=backups
PAGE_LIMIT=100
MAX_RETRIES=5
RETRY_BASE_DELAY_MS=500

GDRIVE_PARENT_FOLDER_ID=
GDRIVE_BACKUPS_ROOT_NAME=AppwriteBackups
GDRIVE_RETENTION_COUNT=14
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GDRIVE_SCOPES=https://www.googleapis.com/auth/drive
```

## Appwrite API Key (Least Privilege Guidance)

Create a server API key with the minimum permissions needed to read:
- database metadata (list collections)
- documents in the target database collections

Avoid granting write/update/delete scopes if backup-only behavior is desired.

## Google Drive OAuth Setup (My Drive)

1. In Google Cloud Console, enable **Google Drive API**.
2. Create an OAuth Client ID (Desktop App is recommended).
3. Configure OAuth consent screen.
4. If consent screen is in **Testing** mode, add your Gmail as a **Test User**.
5. Create/choose a folder in My Drive (example: `Cofellow Backups`) and copy its folder ID into `GDRIVE_PARENT_FOLDER_ID`.
6. Run one-time auth:

```bash
npm run gdrive:auth
```

This starts a local callback server on `127.0.0.1` random port, opens browser consent, and writes `.gdrive_tokens.json`.

Auth error guidance:
- `access_denied`: your account likely not in OAuth Test Users while app is in Testing mode.
- `invalid_client`: wrong OAuth client id/secret or mismatched Google Cloud project.

## Commands

Run full backup:

```bash
npm run backup
```

With flags:

```bash
npm run backup -- --db=<id> --out=<dir> --limit=<n> --collection=<id> --dry-run --no-drive --retention=<n>
```

Flags:
- `--db=<id>` override `APPWRITE_DATABASE_ID`
- `--out=<dir>` override `OUTPUT_DIR`
- `--limit=<n>` override `PAGE_LIMIT`
- `--collection=<id>` backup only one collection
- `--dry-run` validate credentials + list collections, no file writes
- `--no-drive` skip Drive upload + retention
- `--retention=<n>` override `GDRIVE_RETENTION_COUNT`

Exit code behavior:
- `0`: `success` or `partial_success`
- non-zero: `failed`

## Drive Upload + Retention Behavior

Uploads are placed under:

`GDRIVE_PARENT_FOLDER_ID / GDRIVE_BACKUPS_ROOT_NAME / YYYY-MM-DD / appwrite_backup_<projectId>_<databaseId>_<YYYY-MM-DD_HH-mm-ss>.zip`

Retention keeps the newest `GDRIVE_RETENTION_COUNT` backup zip files by `createdTime` across:
- the root backup folder
- its direct date subfolders

Older backups beyond retention are deleted and logged in `logs.txt` + `manifest.json`.

## Manifest

`manifest.json` includes at least:
- `startedAt`, `finishedAt`, `durationMs`
- `appwrite` endpoint/projectId/databaseId
- `pageLimit`, retry settings
- per-collection status/counts/errors
- `driveUpload` metadata (folder ids, file id, filename, uploaded timestamp, size)
- `overallStatus`: `success | partial_success | failed`

## Scheduling with Cron

Example daily run at 2:30 AM:

```cron
30 2 * * * cd /path/to/repo/scripts/appwrite-backup && /usr/bin/npm run backup >> cron.log 2>&1
```

On Windows, use Task Scheduler and run:

`npm run backup` in `scripts/appwrite-backup`.

## Restore Guidance

Re-import by reading each NDJSON file line-by-line and calling Appwrite `createDocument` for each line payload.

Notes:
- document IDs and permission metadata may require custom handling
- permissions from source may not be preserved by default

## Security

- `.gdrive_tokens.json` is ignored and must never be committed.
- Keep `.env` local and private.
- Rotate Appwrite API keys and Google OAuth secrets if exposed.
