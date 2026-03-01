import fs from "node:fs";
import path from "node:path";

export class NdjsonWriter {
  private stream: fs.WriteStream;

  constructor(filePath: string) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    this.stream = fs.createWriteStream(filePath, { flags: "w", encoding: "utf8" });
  }

  write(document: unknown): void {
    this.stream.write(`${JSON.stringify(document)}\n`);
  }

  async close(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.stream.end(() => resolve());
      this.stream.on("error", reject);
    });
  }
}
