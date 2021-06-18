const { middlewareMapFieldMaskValues } = require("./middleware-map-field-mask-values");

describe("Not set field mask", () => {
  test("Should call next middleware", () => {
    const mockCall = { request: {} };
    const mockCallback = jest.fn();
    const mockNext = jest.fn();

    middlewareMapFieldMaskValues(mockCall, mockCallback, mockNext);

    expect(mockCallback).not.toBeCalled();
    expect(mockNext).toBeCalledTimes(1);
  });
});

describe("Wrong field mask config", () => {
  test("not specify field body", () => {
    const mockCall = { request: { entity: {}, __update_field_mask__: { paths: ["name"] } } };
    const mockCallback = jest.fn();
    const mockNext = jest.fn();

    middlewareMapFieldMaskValues(mockCall, mockCallback, mockNext);

    expect(mockCallback).not.toBeCalled();
    expect(mockNext).toBeCalledTimes(1);
  });

  test("wrong config field body", () => {
    const mockCall = { request: { entity: {}, __update_field_mask__wrongEntity: { paths: ["name"] } } };
    const mockCallback = jest.fn();
    const mockNext = jest.fn();

    middlewareMapFieldMaskValues(mockCall, mockCallback, mockNext);

    expect(mockCallback).not.toBeCalled();
    expect(mockNext).toBeCalledTimes(1);
  });
});

describe("Field mask paths list empty", () => {
  test("Should call next middleware", () => {
    const mockCall = {
      request: { entity: {}, __update_field_mask__entity: { paths: [] } },
    };
    const mockCallback = jest.fn();
    const mockNext = jest.fn();

    middlewareMapFieldMaskValues(mockCall, mockCallback, mockNext);

    expect(mockCallback).not.toBeCalled();
    expect(mockNext).toBeCalledTimes(1);
  });
});

describe("Field mask has paths", () => {
  describe("Contains a path not exist in schema", () => {
    test("Should return error invalid request", () => {
      const mockCall = {
        schema: {
          entity: {
            type: "object",
            props: {
              name: { type: "string", defaultValue: "", optional: true },
            },
          },
        },
        request: { entity: {}, __update_field_mask__entity: { paths: ["name", "non_exist"] } },
      };
      const mockCallback = jest.fn();
      const mockNext = jest.fn();

      middlewareMapFieldMaskValues(mockCall, mockCallback, mockNext);

      expect(mockNext).not.toBeCalled();
      expect(mockCallback).toBeCalledWith(
        {
          code: 3,
          message: `Your request is invalid due to field 'non_exist' does not exist. Please, verify and resubmit.`,
          metadata: { _internal_repr: { "x-error-type": ["invalid_request_error"] }, flags: 0 },
        },
        null,
      );
    });
  });

  test("Should set value for zero-value field and ignore fields have been set", () => {
    const mockCall = {
      schema: {
        entity: {
          type: "object",
          props: {
            name: { type: "string", defaultValue: "", optional: true },
            description: { type: "string", defaultValue: "", optional: true },
            A: {
              type: "object",
              props: {
                B: { type: "string", defaultValue: "", optional: true },
                C: {
                  type: "object",
                  props: {
                    D: { type: "number", defaultValue: 0, optional: true },
                  },
                },
              },
            },
          },
        },
      },
      request: {
        entity: { name: "already set", A: { B: "B string" } },
        __update_field_mask__entity: { paths: ["name", "description", "A.B", "A.C.D"] },
      },
    };
    const mockCallback = jest.fn();
    const mockNext = jest.fn();

    middlewareMapFieldMaskValues(mockCall, mockCallback, mockNext);

    expect(mockCallback).not.toBeCalled();
    expect(mockNext).toBeCalled();
    expect(mockCall.schema).toEqual(mockCall.schema); // test does not modify schema
    expect(mockCall.request.entity).toEqual({
      name: "already set",
      description: "",
      A: { B: "B string", C: { D: 0 } },
    });
  });
});
