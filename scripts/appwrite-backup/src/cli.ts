import { runBackup } from "./backup.js";
import { runGoogleDriveAuthFlow } from "./gdrive-auth.js";

interface ParsedArgs {
  command: "backup" | "gdrive:auth";
  db?: string;
  out?: string;
  limit?: number;
  collection?: string;
  dryRun: boolean;
  noDrive: boolean;
  retention?: number;
}

function parseArgs(argv: string[]): ParsedArgs {
  const firstArg = argv[0];
  const isExplicitCommand = firstArg === "backup" || firstArg === "gdrive:auth";
  const command: ParsedArgs["command"] =
    firstArg === "gdrive:auth" ? "gdrive:auth" : "backup";
  const flags = isExplicitCommand ? argv.slice(1) : argv;

  const parsed: ParsedArgs = {
    command,
    dryRun: false,
    noDrive: false,
  };

  for (const flag of flags) {
    if (flag === "--dry-run") {
      parsed.dryRun = true;
      continue;
    }
    if (flag === "--no-drive") {
      parsed.noDrive = true;
      continue;
    }
    if (flag.startsWith("--db=")) {
      parsed.db = flag.slice("--db=".length);
      continue;
    }
    if (flag.startsWith("--out=")) {
      parsed.out = flag.slice("--out=".length);
      continue;
    }
    if (flag.startsWith("--limit=")) {
      parsed.limit = Number(flag.slice("--limit=".length));
      continue;
    }
    if (flag.startsWith("--collection=")) {
      parsed.collection = flag.slice("--collection=".length);
      continue;
    }
    if (flag.startsWith("--retention=")) {
      parsed.retention = Number(flag.slice("--retention=".length));
      continue;
    }
    if (flag === "--help" || flag === "-h") {
      printHelp();
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${flag}`);
  }

  if (parsed.limit !== undefined && (!Number.isFinite(parsed.limit) || parsed.limit <= 0)) {
    throw new Error("--limit must be a positive number.");
  }
  if (
    parsed.retention !== undefined &&
    (!Number.isFinite(parsed.retention) || parsed.retention <= 0)
  ) {
    throw new Error("--retention must be a positive number.");
  }
  return parsed;
}

function printHelp(): void {
  console.log(`Usage:
  npm run backup -- [--db=<id>] [--out=<dir>] [--limit=<n>] [--collection=<id>] [--dry-run] [--no-drive] [--retention=<n>]
  npm run gdrive:auth
`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.command === "gdrive:auth") {
    await runGoogleDriveAuthFlow();
    return;
  }

  const result = await runBackup({
    databaseId: args.db,
    outputDir: args.out,
    pageLimit: args.limit,
    collectionId: args.collection,
    dryRun: args.dryRun,
    noDrive: args.noDrive,
    retentionCount: args.retention,
  });

  process.exitCode = result.status === "failed" ? 1 : 0;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Backup command failed: ${message}`);
  process.exitCode = 1;
});
