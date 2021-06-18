/* istanbul ignore file */

const { loadSingletons } = require("./configuration/infrastructure");

(async () => {
  await loadSingletons();
  require("./configuration/infrastructure");
  require("./configuration/application");
  require("./configuration/entrypoints");
})();
