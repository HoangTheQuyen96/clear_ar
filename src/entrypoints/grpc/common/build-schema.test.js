jest.mock("protobufjs");

const { buildSchema } = require("./build-schema");
const protobuf = require("protobufjs");

test("Should support all protobuf types", () => {
  const mockMessage = {
    fields: {
      field_double: { type: "double" },
      field_float: { type: "float" },
      field_int32: { type: "int32" },
      field_int64: { type: "int64" },
      field_uint32: { type: "uint32" },
      field_uint64: { type: "uint64" },
      field_sint32: { type: "sint32" },
      field_sint64: { type: "sint64" },
      field_fixed32: { type: "fixed32" },
      field_fixed64: { type: "fixed64" },
      field_sfixed32: { type: "sfixed32" },
      field_sfixed64: { type: "sfixed64" },
      field_bool: { type: "bool" },
      field_string: { type: "string" },
      field_bytes: { type: "bytes" },
      field_required: { type: "string", options: { "(google.api.field_behavior)": "REQUIRED" } },
      field_repeated: { rule: "repeated", type: "string" },
      field_object_nested: { type: "object", fields: { type: "nestedField" } },
      field_object_nested_repeated: { rule: "repeated", type: "object", fields: { type: "nestedField" } },
      field_custom_BoolValue: { type: "google.protobuf.BoolValue" },
      field_custom_StringValue: { type: "google.protobuf.StringValue" },
    },
  };
  const mockProto = {
    lookupType: jest
      .fn()
      .mockReturnValueOnce(mockMessage)
      // For testing nested field
      .mockReturnValue({
        fields: {
          nestedFieldA: { type: "string", options: { "(google.api.field_behavior)": "REQUIRED" } },
          nestedFieldB: { type: "string" },
        },
      }),
  };

  protobuf.Root.prototype.loadSync = jest.fn().mockReturnValue(mockProto);

  const mockService = {
    service: {
      requestType: {
        type: {
          name: "mockMessage",
        },
      },
    },
  };

  const schema = buildSchema("mockProtoPath", mockService);

  expect(schema).toEqual({
    service: {
      field_double: { type: "number", defaultValue: 0, optional: true },
      field_float: { type: "number", defaultValue: 0, optional: true },
      field_int32: { type: "number", defaultValue: 0, optional: true },
      field_int64: { type: "number", defaultValue: 0, optional: true },
      field_uint32: { type: "number", defaultValue: 0, optional: true },
      field_uint64: { type: "number", defaultValue: 0, optional: true },
      field_sint32: { type: "number", defaultValue: 0, optional: true },
      field_sint64: { type: "number", defaultValue: 0, optional: true },
      field_fixed32: { type: "number", defaultValue: 0, optional: true },
      field_fixed64: { type: "number", defaultValue: 0, optional: true },
      field_sfixed32: { type: "number", defaultValue: 0, optional: true },
      field_sfixed64: { type: "number", defaultValue: 0, optional: true },
      field_bool: { type: "boolean", defaultValue: false, optional: true },
      field_string: { type: "string", defaultValue: "", optional: true },
      field_bytes: { type: "array", defaultValue: [], optional: true },
      field_required: { type: "string", defaultValue: "" },
      field_repeated: { type: "array", defaultValue: [], items: { type: "string", defaultValue: "" }, optional: true },
      field_object_nested: {
        type: "object",
        props: {
          nestedFieldA: { type: "string", defaultValue: "" },
          nestedFieldB: { type: "string", defaultValue: "", optional: true },
        },
        optional: true,
      },
      field_object_nested_repeated: {
        type: "array",
        defaultValue: [],
        items: {
          type: "object",
          props: {
            nestedFieldA: { type: "string", defaultValue: "" },
            nestedFieldB: { type: "string", defaultValue: "", optional: true },
          },
        },
        optional: true,
      },
      field_custom_BoolValue: {
        type: "custom",
        defaultValue: false,
        customTypeName: "google.protobuf.BoolValue",
        optional: true,
        check: expect.any(Function),
      },
      field_custom_StringValue: {
        type: "custom",
        defaultValue: "",
        customTypeName: "google.protobuf.StringValue",
        optional: true,
        check: expect.any(Function),
      },
    },
  });
});
