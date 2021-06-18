jest.mock("./providers/winston", () => ({
  Winston: jest.fn(),
}));
const { Winston } = require("./providers/winston");
const { Logger } = require("./logger");

const option = {
  serverName: "Name",
  logLevel: "debug",
};
describe("Test Logger class", () => {
  test("Init Logger class successfully", () => {
    Winston.mockReturnValue({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    });
    const logger = new Logger(option);
    logger.info("info");
    logger.debug("debug");
    logger.warn("warn");
    logger.error("error");
    expect(Winston).toHaveBeenCalled();
  });

  test("Call func setTraceId when execute func info with instance winston is null", () => {
    Winston.mockReturnValue(null).mockReturnValueOnce({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    });
    const logger = new Logger(option);
    logger.info("info");
    expect(Winston).toHaveBeenCalled();
  });

  test("Call func setTraceId when execute func warn with instance winston is null", () => {
    Winston.mockReturnValue(null).mockReturnValueOnce({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    });
    const logger = new Logger(option);
    logger.warn("warn");
    expect(Winston).toHaveBeenCalled();
  });
  test("Call func setTraceId when execute func error with instance winston is null", () => {
    Winston.mockReturnValue(null).mockReturnValueOnce({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    });
    const logger = new Logger(option);
    logger.error("info");
    expect(Winston).toHaveBeenCalled();
  });
  test("Call func setTraceId when execute func debug with instance winston is null", () => {
    Winston.mockReturnValue(null).mockReturnValueOnce({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    });
    const logger = new Logger(option);
    logger.debug("info");
    expect(Winston).toHaveBeenCalled();
  });

  test("It should execute methods if winston already initiated", async () => {
    Winston.mockReturnValue({ info: jest.fn() });
    const logger = new Logger(option);
    logger.setTraceId("a", "a", "aaa");
    logger.info("a");
    expect(logger.winston.info).toHaveBeenCalled();
  });
});
