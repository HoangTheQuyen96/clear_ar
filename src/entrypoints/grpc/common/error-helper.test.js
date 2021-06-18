const grpc = require("grpc");
const { errorHelper } = require("./error-helper");
const { CustomErrorEnum } = require("../../../application/common/custom-error-enum");
const { ErrorType } = require("../../../application/common/error-type");
const { CustomError } = require("../../../application/common/custom-error");

test("It should return an INVALID_ARGUMENT error with custom error message", () => {
  const errorMessage = "Missing parameter";
  const fakeError = new CustomError(CustomErrorEnum.MissingRequiredParameter, errorMessage);

  const metadata = new grpc.Metadata();
  metadata.set("x-error-type", CustomErrorEnum.MissingRequiredParameter.errorType);
  const expectedResult = {
    code: CustomErrorEnum.MissingRequiredParameter.grpcCode,
    message: errorMessage,
    metadata,
  };

  const result = errorHelper(fakeError);

  expect(result.code).toEqual(expectedResult.code);
  expect(result.message).toEqual(expectedResult.message);
  expect(result.metadata).toEqual(expectedResult.metadata);
});

test("It should return an default error with undefined error input", () => {
  const fakeError = new CustomError({}, undefined);

  const metadata = new grpc.Metadata();
  metadata.set("x-error-type", ErrorType.ApiError);
  const expectedResult = {
    code: grpc.status.INTERNAL,
    message: "An unexpected error occurred on Promotion System's end.",
    metadata,
  };

  const result = errorHelper(fakeError);

  expect(result.code).toEqual(expectedResult.code);
  expect(result.message).toEqual(expectedResult.message);
  expect(result.metadata).toEqual(expectedResult.metadata);
});
