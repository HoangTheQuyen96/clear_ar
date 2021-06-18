/**
  - Description: This functon use to connect to Mongo Db
  - Input: mongoUrl
  }
  - Output: resolve
 */

jest.mock("mongoose");

const mongoose = require("mongoose");

const { MongoDb } = require("./mongo-db");

describe("Test Mongo DB", () => {
  test("MongoDb connection successfully", async () => {
    const mockInject = {
      mongoUrl: "mongodb://localhost:27017/scheduler",
      connect: jest.fn().mockRejectedValue({}),
    };

    mongoose.connect = jest.fn();

    const mongoDb = new MongoDb(mockInject);

    await mongoDb.connect();

    expect(mongoose.connect).toBeCalledTimes(1);
    expect(mongoose.connect).toHaveBeenCalledWith(mockInject.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
});
