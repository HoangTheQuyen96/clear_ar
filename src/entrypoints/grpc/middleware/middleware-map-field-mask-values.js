const grpc = require("grpc");
const flatten = require("flat");

const { ErrorType } = require("../../../application/common/error-type");

/**
 * Map field mask to request body
 * The field mask should follow pattern `__update_field_mak__<field_body_request>`
 * E.g:
  ```
  message UpdateEntityRequest {
    string id = 1 [(google.api.field_behavior) = REQUIRED];
    UpdateEntityBody entity = 2;
    google.protobuf.FieldMask __update_field_mask__entity = 3;
  }
  ```
 */
module.exports.middlewareMapFieldMaskValues = (call, callback, next) => {
  const key = Object.keys(call.request).find((k) => k.includes("__update_field_mask__"));
  if (!key || !call.request[key].paths || !call.request[key].paths.length) return next();

  const paths = call.request[key].paths;

  const objKey = key.substr("__update_field_mask__".length);
  if (!objKey || !call.request[objKey]) return next();

  // Get schema fields with default values
  const fields = Object.entries(flatten(call.schema))
    .filter(([k, v]) => k.includes("defaultValue") && k.includes(`${objKey}.`))
    .map(([k, v]) => [
      k
        .replace(`${objKey}.`, "")
        .replace(/props\./g, "")
        .replace(/\.defaultValue$/, ""),
      v,
    ]);

  // Valid non-exist path in request
  // then response error InvalidRequestError
  let nonExistPath;
  paths.some((p) => {
    const f = fields.find(([k]) => k === p);
    if (!f) nonExistPath = p;
    return !!nonExistPath;
  });
  if (nonExistPath) return callback(buildError(nonExistPath), null);

  // Map field mask paths default value to request zero-value fields
  paths.forEach(
    (path) =>
      typeof getPropertyValueByPath(call.request[objKey], path.split(".")) === "undefined" &&
      setPropertyValueByPath(call.request[objKey], path.split("."), fields.find(([k, v]) => k === path)[1]),
  );

  next();
};

/**
 * Build error for grpc response with metadata
 *
 * @param {String} path
 */
function buildError(path) {
  const metadata = new grpc.Metadata();
  metadata.add("x-error-type", ErrorType.InvalidRequestError);
  return {
    metadata,
    code: grpc.status.INVALID_ARGUMENT,
    message: `Your request is invalid due to field '${path}' does not exist. Please, verify and resubmit.`,
  };
}

/**
 * Set value for object property using path.
 * Example:
 * ```
 * const obj = {};
 * setPropertyValueByPath(obj, ["a", "b"], 1);
 * console.log(obj) // => { a: { b: 1 } }
 * ```
 * @param {Object} obj Object to be modified
 * @param {String[]} path path to object property. E.g: `["a", "b", "c"]`, `"a.b.c".split(".")`
 * @param {*} value value to set
 */
function setPropertyValueByPath(obj, path, value) {
  if (typeof obj[path[0]] === "undefined") obj[path[0]] = {};
  if (path.length === 1) obj[path[0]] = value;
  else setPropertyValueByPath(obj[path.shift()], path, value);
}

/**
 * Get value from object property using path.
 * Example:
 * ```
 * getPropertyValueByPath({ a: { b: 1 } }, ["a", "b"]) // => 1
 * getPropertyValueByPath({ a: { b: 1 } }, ["a", "c"]) // => undefined
 * ```
 * @param {Object} obj Object to be get value
 * @param {String[]} path path to object property. E.g: `["a", "b", "c"]`, `"a.b.c".split(".")`
 */
function getPropertyValueByPath(obj, path) {
  if (typeof obj[path[0]] === "undefined") return;
  else if (path.length === 1) return obj[path[0]];
  else return getPropertyValueByPath(obj[path.shift()], path);
}
