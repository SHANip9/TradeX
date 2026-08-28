/**
 * ============================================================================
 * TradeX Development Orchestrator Script (start-dev.js)
 * ============================================================================
 * Purpose:
 *   Concurrently starts all 3 micro-services in the TradeX ecosystem:
 *     1. Backend API Server (Express + MongoDB) -> Port 3002
 *     2. Frontend Landing Website (React)      -> Port 3000
 *     3. Trading Dashboard (React)             -> Port 3001
 *
 * Key Functionalities:
 *   - Spawns cross-platform child processes (supports Windows npm.cmd and Linux/macOS npm).
 *   - Intercepts and prefixes stdout/stderr output streams with service names for clean logging.
 *   - Handles graceful termination (SIGINT / SIGTERM) to kill all child processes cleanly.
 * ============================================================================
 */

const { spawn } = require("child_process");
const path = require("path");

// Resolve the root directory of the TradeX repository
const rootDir = path.resolve(__dirname, "..");

// Detect Windows environment to execute 'npm.cmd', otherwise standard 'npm' for POSIX
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

// Definition of each micro-service to be spawned
const services = [
  {
    name: "backend",
    cwd: path.join(rootDir, "backend"),
    env: {},
  },
  {
    name: "frontend",
    cwd: path.join(rootDir, "frontend"),
    env: { BROWSER: "none", PORT: "3000" }, // Disable auto-opening browser window & lock to port 3000
  },
  {
    name: "dashboard",
    cwd: path.join(rootDir, "dashboard"),
    env: { BROWSER: "none", PORT: "3001" }, // Disable auto-opening browser window & lock to port 3001
  },
];

// Spawn child process for each service and pipe prefixed logs to main stdout/stderr
const children = services.map((service) => {
  const child = spawn(npmCommand, ["start"], {
    cwd: service.cwd,
    env: { ...process.env, ...service.env },
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
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

/**
 * Graceful shutdown handler: kills all spawned child processes when user hits Ctrl+C
 */
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

console.log("Starting TradeX Ecosystem:");
console.log("Frontend (Landing Page): http://localhost:3000");
console.log("Trading Dashboard:       http://localhost:3001");
console.log("Backend API Server:      http://localhost:3002");
