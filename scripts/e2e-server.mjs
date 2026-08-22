import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pidFile = path.join(root, ".next", "e2e-server.pid");
await mkdir(path.dirname(pidFile), { recursive: true });

const server = spawn(process.execPath, [path.join(root, ".next", "standalone", "server.js")], {
  cwd: root,
  env: { ...process.env, HOSTNAME: "localhost", PORT: "3000" },
  stdio: "inherit",
});

await writeFile(pidFile, String(server.pid), "utf8");

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.kill(signal));
}

server.on("exit", (code) => process.exit(code ?? 0));
