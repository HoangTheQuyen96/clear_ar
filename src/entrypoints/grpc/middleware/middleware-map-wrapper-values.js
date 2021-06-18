/* istanbul ignore file */
const flatten = require("flat");

const { CUSTOM_TYPES } = require("../common/build-schema");

module.exports.middlewareMapWrapperValues = (call, callback, next) => {
  Object.entries(flatten(call.schema))
    .filter(([k, v]) => k.includes("customTypeName") && v.includes("google.protobuf."))
    .map(([key, type]) => [key.replace("props.", "").replace(".customTypeName", "").split("."), type])
    .forEach(([key, type]) => {
      try {
        const v = getPropertyValueByPath(call.request, [...key, "value"]) || CUSTOM_TYPES[type].default;
        updatePropertyValueByPath(call.request, key, v);
      } catch (error) {}
    });

  next();
};

/**
 * @param {String[]} path
 */
function updatePropertyValueByPath(obj, path, value) {
  if (path.length === 1) obj[path[0]] = value;
  else if (typeof obj[path[0]] === "undefined") return;
  else {
    updatePropertyValueByPath(obj[path.shift()], path, value);
  }
}

/**
 * @param {String[]} path
 */
function getPropertyValueByPath(obj, path) {
  if (typeof obj[path[0]] === "undefined") return undefined;
  if (path.length === 1) return obj[path[0]];
  else {
    return getPropertyValueByPath(obj[path.shift()], path);
  }
}
