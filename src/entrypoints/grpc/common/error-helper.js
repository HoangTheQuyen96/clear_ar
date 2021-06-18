const grpc = require("grpc");

const { CustomErrorEnum } = require("../../../application/common/custom-error-enum");
const { ErrorType } = require("../../../application/common/error-type");

module.exports.errorHelper = function errorHelper(error, fallbackMessage = "An unexpected error occurred on Promotion system's end.") {
  const metadata = new grpc.Metadata();

  if (CustomErrorEnum[error.code]) {
    metadata.add("x-error-type", CustomErrorEnum[error.code].errorType);
    return { code: CustomErrorEnum[error.code].grpcCode, message: error.message, metadata };
  }

  metadata.add("x-error-type", ErrorType.ApiError);
  return { code: grpc.status.INTERNAL, message: fallbackMessage, metadata };
};
