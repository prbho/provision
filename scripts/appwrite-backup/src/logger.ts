import fs from "node:fs";
import path from "node:path";

export class Logger {
  private stream?: fs.WriteStream;

  constructor(logFilePath?: string) {
    if (logFilePath) {
      fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
      this.stream = fs.createWriteStream(logFilePath, { flags: "a", encoding: "utf8" });
    }
  }

  info(message: string): void {
    this.write("INFO", message);
  }

  warn(message: string): void {
    this.write("WARN", message);
  }

  error(message: string): void {
    this.write("ERROR", message);
  }

  private write(level: "INFO" | "WARN" | "ERROR", message: string): void {
    const line = `[${new Date().toISOString()}] [${level}] ${message}`;
    if (level === "ERROR") {
      console.error(line);
    } else {
      console.log(line);
    }
    if (this.stream) {
      this.stream.write(`${line}\n`);
    }
  }

  async close(): Promise<void> {
    if (!this.stream) {
      return;
    }
    await new Promise<void>((resolve, reject) => {
      this.stream?.end(() => resolve());
      this.stream?.on("error", reject);
    });
  }
}
