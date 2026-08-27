const { spawn } = require("child_process");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const services = [
  {
    name: "backend",
    cwd: path.join(rootDir, "backend"),
    env: {},
  },
  {
    name: "frontend",
    cwd: path.join(rootDir, "frontend"),
    env: { BROWSER: "none", PORT: "3000" },
  },
  {
    name: "dashboard",
    cwd: path.join(rootDir, "dashboard"),
    env: { BROWSER: "none", PORT: "3001" },
  },
];

const children = services.map((service) => {
  const child = spawn(npmCommand, ["start"], {
    cwd: service.cwd,
    env: { ...process.env, ...service.env },
    stdio: ["ignore", "pipe", "pipe"],
  });

  const prefix = `[${service.name}]`;
  child.stdout.on("data", (chunk) => process.stdout.write(`${prefix} ${chunk}`));
  child.stderr.on("data", (chunk) => process.stderr.write(`${prefix} ${chunk}`));
  child.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.error(`${prefix} exited with code ${code}`);
    }
  });

  return child;
});

const shutdown = () => {
  children.forEach((child) => {
    if (!child.killed) {
      child.kill();
    }
  });
  process.exit();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log("Starting TradeX:");
console.log("Frontend:  http://localhost:3000");
console.log("Dashboard: http://localhost:3001");
console.log("Backend:   http://localhost:3002");
