import fs from "node:fs";
import path from "node:path";
import archiver from "archiver";

export async function zipBackupFolder(backupDir: string, zipFilePath: string): Promise<void> {
  await fs.promises.mkdir(path.dirname(zipFilePath), { recursive: true });
  await new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve());
    output.on("error", reject);
    archive.on("error", reject);

    archive.pipe(output);
    archive.glob("**/*", {
      cwd: backupDir,
      ignore: ["backup.zip"],
      dot: true,
    });
    archive.finalize().catch(reject);
  });
}
