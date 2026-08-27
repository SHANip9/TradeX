const redactMongoUrl = (uri = "") => {
  if (!uri) {
    return "";
  }

  return uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:<password>@");
};

const getMongoHost = (uri = "") => {
  const match = uri.match(/@([^/?]+)/);
  return match ? match[1] : "";
};

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
