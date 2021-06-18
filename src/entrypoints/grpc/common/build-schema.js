const protobuf = require("protobufjs");

const PROTOBUF_TYPES = {
  double: { default: 0, jsType: "number" },
  float: { default: 0, jsType: "number" },
  int32: { default: 0, jsType: "number" },
  int64: { default: 0, jsType: "number" },
  uint32: { default: 0, jsType: "number" },
  uint64: { default: 0, jsType: "number" },
  sint32: { default: 0, jsType: "number" },
  sint64: { default: 0, jsType: "number" },
  fixed32: { default: 0, jsType: "number" },
  fixed64: { default: 0, jsType: "number" },
  sfixed32: { default: 0, jsType: "number" },
  sfixed64: { default: 0, jsType: "number" },
  bool: { default: false, jsType: "boolean" },
  string: { default: "" },
  bytes: { default: [], jsType: "array" },
};

const CUSTOM_TYPES = {
  "google.protobuf.BoolValue": {
    default: false,
    check: (obj, schema) => {
      return (
        ["boolean", "undefined"].includes(typeof obj.value) || [
          {
            message: "The '{field}' field must be a {expected}",
            type: "google.protobuf.BoolValue",
            expected: "boolean",
            actual: obj.value,
          },
        ]
      );
    },
  },
  "google.protobuf.StringValue": {
    default: "",
    check: (obj, schema) => {
      return (
        ["string", "undefined"].includes(typeof obj.value) || [
          {
            message: "The '{field}' field must be a {expected}",
            type: "google.protobuf.StringValue",
            expected: "string",
            actual: obj.value,
          },
        ]
      );
    },
  },

  "openapis.masterdata.v1.Pagination": {
    default: "",
    check: (obj, schema) => {
      return (
        ["string", "undefined"].includes(typeof obj.value) || [
          {
            message: "The '{field}' field must be a {expected}",
            type: "google.protobuf.StringValue",
            expected: "string",
            actual: obj.value,
          },
        ]
      );
    },
  },
};

/* istanbul ignore next */
function buildSchema(protoFile, services) {
  const protos = new protobuf.Root().loadSync(protoFile, { keepCase: true });

  const schema = {};
  Object.entries(services).forEach(
    ([key, svc]) => (schema[key] = buildMessageSchema(protos.lookupType(svc.requestType.type.name), protos)),
  );

  return schema;
}

function buildMessageSchema(message, protos) {
  if (!message) return null;
  const schema = {};
  Object.entries(message.fields).forEach(([key, field]) => {
    const tmp = {};

    if (PROTOBUF_TYPES[field.type]) {
      tmp.type = PROTOBUF_TYPES[field.type].jsType || field.type;
      // naming "defaultValue" to not conflict with fast-validator built-in default option
      tmp.defaultValue = PROTOBUF_TYPES[field.type].default;
    } else if (CUSTOM_TYPES[field.type]) {
      tmp.type = "custom";
      // naming "defaultValue" to not conflict with fastest-validator built-in default option
      tmp.defaultValue = CUSTOM_TYPES[field.type].default;
      tmp.customTypeName = field.type;
      tmp.check = CUSTOM_TYPES[field.type].check;
    } else {
      tmp.type = "object";
      tmp.props = buildMessageSchema(protos.lookupType(field.type), protos);
    }

    if (field.rule === "repeated") {
      schema[key] = {
        type: "array",
        defaultValue: [],
        items: tmp,
      };
    } else {
      schema[key] = tmp;
    }

    if (
      !field.options ||
      !field.options["(google.api.field_behavior)"] ||
      field.options["(google.api.field_behavior)"] !== "REQUIRED"
    ) {
      schema[key].optional = true;
    }
  });

  return schema;
}

module.exports.PROTOBUF_TYPES = PROTOBUF_TYPES;
module.exports.CUSTOM_TYPES = CUSTOM_TYPES;
module.exports.buildSchema = buildSchema;
