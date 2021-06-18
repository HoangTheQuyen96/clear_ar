const grpc = require("grpc");

const { ErrorType } = require("./error-type");

const CustomErrorEnum = {
  MissingRequiredParameter: {
    errorType: ErrorType.InvalidRequestError,
    errorCode: "MissingRequiredParameter",
    grpcCode: grpc.status.INVALID_ARGUMENT,
    statusCode: 400,
    status: 400
  },
  CreatePromotionError: {
    errorType: ErrorType.ApiError,
    errorCode: "CreatePromotionError",
    grpcCode: grpc.status.INTERNAL,
    statusCode: 500,
    status: 500
  },
};

module.exports.CustomErrorEnum = CustomErrorEnum;
