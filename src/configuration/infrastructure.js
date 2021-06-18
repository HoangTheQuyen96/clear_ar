const { Logger } = require("../infrastructure/logger/logger");
const { MongoDb } = require("../infrastructure/data-gateway/providers/mongodb/mongo-db");
const { DataGateway } = require("../infrastructure/data-gateway/data-gateway");

const logger = new Logger({
  serverName: process.env.SERVER_NAME,
  logLevel: process.env.LOG_LEVEL || "debug",
});


let mongoDb;
module.exports.loadSingletons = async () => {
  mongoDb = new MongoDb({ mongoUrl: process.env.MONGO_URI });

  try {
    await mongoDb.connect();
    logger.info(`[MONGO] connected to: ${process.env.MONGO_URI}`);
  } catch (error) {
    logger.log(error);
    logger.error("[MONGO] connected failure");
    process.kill(process.pid);
  }
};

module.exports.Logger = class extends Logger {
  constructor() {
    super({
      serverName: process.env.SERVER_NAME,
      logLevel: process.env.LOG_LEVEL || "debug",
    });
  }
};

module.exports.DataGateway = class extends DataGateway {
  constructor() {
    super({
      client: {
        mongoDb,
      },
    });
  }
};
  