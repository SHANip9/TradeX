const dns = require("dns");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });


const {
  getMongoHost,
  getMongoTroubleshootingHint,
  redactMongoUrl,
} = require("../utils/mongoStatus");

const checkDatabase = async () => {
  const uri = process.env.MONGO_URL;
  const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
    console.log(`DNS servers: ${dnsServers.join(", ")}`);
  }

  if (!uri) {
    console.error("MONGO_URL is missing. Current working dir:", process.cwd());
    console.error("To debug, ensure .env is in the cwd and contains: MONGO_URL=...");
    process.exit(1);
  }

  const host = getMongoHost(uri);
  console.log(`Mongo URL: ${redactMongoUrl(uri)}`);
  console.log(`Mongo host: ${host || "unknown"}`);

  if (uri.startsWith("mongodb+srv://") && host) {
    try {
      const srvRecords = await dns.promises.resolveSrv(`_mongodb._tcp.${host}`);
      console.log("SRV records found:");
      srvRecords.forEach((record) => {
        console.log(`- ${record.name}:${record.port}`);
      });
    } catch (error) {
      console.error("SRV lookup failed.");
      console.error(error.message);
      console.error(getMongoTroubleshootingHint(error));
      process.exit(1);
    }
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB connected successfully.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("MongoDB connection failed.");
    console.error(error.message);
    console.error(getMongoTroubleshootingHint(error));
    process.exit(1);
  }
};

checkDatabase();
