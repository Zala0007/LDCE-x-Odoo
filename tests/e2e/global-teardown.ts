import { readFile, rm } from "node:fs/promises";
import path from "node:path";

export default async function globalTeardown() {
  const pidFile = path.join(process.cwd(), ".next", "e2e-server.pid");
  try {
    const pid = Number(await readFile(pidFile, "utf8"));
    if (Number.isInteger(pid) && pid > 0) process.kill(pid, "SIGTERM");
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT" && code !== "ESRCH") throw error;
  } finally {
    await rm(pidFile, { force: true });
  }
}
