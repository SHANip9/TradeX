/**
 * ============================================================================
 * MongoDB Connection Status & Diagnostics Helper (mongoStatus.js)
 * ============================================================================
 * Purpose:
 *   Provides sanitization and diagnostic utilities for MongoDB connection strings,
 *   helping debug DNS SRV lookups, authentication issues, and IP whitelisting.
 *
 * Key Functionalities:
 *   - redactMongoUrl: Masks sensitive passwords in connection logs.
 *   - getMongoHost: Extracts hostname/cluster URL for SRV records verification.
 *   - getMongoTroubleshootingHint: Maps error types to human-readable troubleshooting guidance.
 * ============================================================================
 */

/**
 * Sanitizes MongoDB connection string by replacing passwords with `<password>`
 * to prevent accidental exposure in console outputs and logs.
 *
 * @param {string} uri - Raw connection URI
 * @returns {string} - Redacted connection URI
 */
const redactMongoUrl = (uri = "") => {
  if (!uri) {
    return "";
  }

  return uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:<password>@");
};

/**
 * Extracts cluster domain/host from MongoDB URI.
 *
 * @param {string} uri - MongoDB connection URI
 * @returns {string} - Host string (e.g. cluster0.mongodb.net)
 */
const getMongoHost = (uri = "") => {
  const match = uri.match(/@([^/?]+)/);
  return match ? match[1] : "";
};

/**
 * Inspects error messages to generate clear, actionable troubleshooting advice
 * for MongoDB Atlas setup errors (DNS, authentication, IP access lists).
 *
 * @param {Error} error - Caught connection error object
 * @returns {string} - Recommended resolution step
 */
const getMongoTroubleshootingHint = (error) => {
  const message = error?.message || "";

  if (/querySrv|ENOTFOUND|ECONNREFUSED|EREFUSED/i.test(message)) {
    return "Atlas SRV DNS lookup failed. Check that MONGO_URL has the exact cluster hostname from Atlas.";
  }

  if (/bad auth|Authentication failed/i.test(message)) {
    return "MongoDB authentication failed. Check that MONGO_URL username/password are correct and that authSource matches the database where the user was created (admin vs <db>).";
  }

  if (/MongoServerError|SCRAM|sasl/i.test(message)) {
    return "MongoDB SCRAM/auth negotiation failed. This usually means wrong credentials or wrong authSource for Atlas user.";
  }

  if (/IP|whitelist|access list|not authorized/i.test(message)) {
    return "Atlas network access may be blocking this machine. Add your current IP in Atlas Network Access.";
  }

  return "Check MONGO_URL, Atlas cluster status, database user, and Atlas Network Access.";
};

module.exports = {
  getMongoHost,
  getMongoTroubleshootingHint,
  redactMongoUrl,
};
