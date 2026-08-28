/**
 * ============================================================================
 * MongoDB Diagnostics & Connection Verification Script (check-db.js)
 * ============================================================================
 * Purpose:
 *   CLI diagnostic tool to verify connectivity to MongoDB Atlas cluster.
 *   - Verifies DNS servers & resolves MongoDB Atlas SRV records (_mongodb._tcp.<host>).
 *   - Attempts actual TCP/TLS authentication handshake with 10s timeout.
 *   - Outputs specific troubleshooting recommendations upon failure.
 *
 * Usage:
 *   node backend/scripts/check-db.js
 * ============================================================================
 */

const dns = require("dns");
const mongoose = require("mongoose");
const path = require("path");
// Load environment variables from backend/.env
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const {
  getMongoHost,
  getMongoTroubleshootingHint,
  redactMongoUrl,
} = require("../utils/mongoStatus");

/**
 * Main diagnostic execution function
 */
const checkDatabase = async () => {
  const uri = process.env.MONGO_URL;
  // Parse and set public DNS resolvers (Google 8.8.8.8, Cloudflare 1.1.1.1) to avoid local ISP DNS blocks
  const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
    console.log(`DNS servers configured: ${dnsServers.join(", ")}`);
  }

  if (!uri) {
    console.error("ERROR: MONGO_URL is missing in environment variables.");
    console.error("Current working directory:", process.cwd());
    console.error("Ensure backend/.env contains a valid MONGO_URL=mongodb+srv://...");
    process.exit(1);
  }

  const host = getMongoHost(uri);
  console.log(`Checking Mongo URL: ${redactMongoUrl(uri)}`);
  console.log(`Resolved Mongo host: ${host || "unknown"}`);

  // Perform DNS SRV lookup if using mongodb+srv protocol
  if (uri.startsWith("mongodb+srv://") && host) {
    try {
      console.log(`Querying SRV records for _mongodb._tcp.${host}...`);
      const srvRecords = await dns.promises.resolveSrv(`_mongodb._tcp.${host}`);
      console.log("SRV records successfully resolved:");
      srvRecords.forEach((record) => {
        console.log(` - ${record.name}:${record.port}`);
      });
    } catch (error) {
      console.error("SRV DNS Lookup Failed!");
      console.error(error.message);
      console.error("Diagnostic Hint:", getMongoTroubleshootingHint(error));
      process.exit(1);
    }
  }

  // Attempt database authentication and connection
  try {
    console.log("Attempting Mongoose connection (timeout 10000ms)...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("SUCCESS: MongoDB connected and authenticated successfully.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("MongoDB Connection Handshake Failed!");
    console.error(error.message);
    console.error("Diagnostic Hint:", getMongoTroubleshootingHint(error));
    process.exit(1);
  }
};

checkDatabase();
