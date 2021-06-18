const { Winston } = require("./winston");

describe("Test function Winston", () => {
  test("It should execute success when have enough args", () => {
    const logger = Winston("NodeWatch", "debug", "xxxx", "xxxx", "functionName");
    logger.info("Test logger with message info");
    expect(logger.transports[0].level).toEqual("debug");
  });
  test("It should execute success when don't have args", () => {
    const logger = Winston();
    logger.info();
    expect(logger.transports[0].level).toEqual("debug");
  });
});
