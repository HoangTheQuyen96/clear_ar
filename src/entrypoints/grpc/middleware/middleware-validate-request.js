/* eslint-disable space-before-function-paren */

const grpc = require("grpc");
const Validator = require("fastest-validator");

const { ErrorType } = require("../../../application/common/error-type");

module.exports.middlewareValidateRequest = (call, callback, next) => {
  const result = new Validator({
    messages: {
      string: "|{field}| type must be a string. Please, try again with the valid type.",
      required: "Your request is missing |{field}| parameter. Please, verify and resubmit.",
    },
  }).validate(call.request, call.schema);

  if (result !== true) {
    const metadata = new grpc.Metadata();
    metadata.add("x-error-type", ErrorType.InvalidRequestError);
    const error = {
      code: grpc.status.INVALID_ARGUMENT,
      // This is work around solution for task EBC-1417
      // Reason: the schema validation return field name as protobuf
      // but not the same as RESTful body
      // E.g:
      // message: "Your request is missing |entity.name| parameter. Please, verify and resubmit."
      // will be transform to: "Your request is missing name parameter. Please, verify and resubmit."
      message: result[0].message.replace(/(.*?)\|(.*?\.)*(.*?)\|(.*)/g, "$1$3$4"),
      metadata,
    };
    return callback(error, null);
  }

  next();
};
