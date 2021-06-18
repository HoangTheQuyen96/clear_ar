jest.mock("grpc");
jest.mock("fastest-validator");

const grpc = require("grpc");
const Validator = require("fastest-validator");

const { middlewareValidateRequest } = require("./middleware-validate-request");

test("Should return error if request not pass schema", () => {
  const mockCall = { schema: {}, request: {} };
  const mockCallback = jest.fn();
  const mockNext = jest.fn();
  Validator.prototype.validate = jest.fn().mockReturnValue([{ message: "Mock message" }]);

  middlewareValidateRequest(mockCall, mockCallback, mockNext);

  expect(mockNext).not.toBeCalled();
  expect(mockCallback).toBeCalledWith({ code: 3, message: "Mock message", metadata: expect.anything() }, null);
});

test("Should return call next middleware if request pass schema", () => {
  const mockCall = { schema: {}, request: {} };
  const mockCallback = jest.fn();
  const mockNext = jest.fn();
  Validator.prototype.validate = jest.fn().mockReturnValue(true);

  middlewareValidateRequest(mockCall, mockCallback, mockNext);

  expect(mockNext).toBeCalled();
  expect(mockCallback).not.toBeCalled();
});
