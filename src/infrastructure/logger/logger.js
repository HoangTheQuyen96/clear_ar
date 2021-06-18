const { Winston } = require("./providers/winston");

module.exports.Logger = class {
  /**
   * @param {Object} options
   * @param {String} options.serverName
   * @param {String} options.logLevel
   */
  constructor(options) {
    this.options = options;
  }

  setTraceId(traceId = "", jaegerTraceId = "", domainName = "") {
    this.winston = Winston(this.options.serverName, this.options.logLevel, traceId, jaegerTraceId, domainName);
  }

  info(data) {
    if (!this.winston) this.setTraceId();
    this.winston.info(data);
  }

  warn(data) {
    if (!this.winston) this.setTraceId();
    this.winston.warn(data);
  }

  error(data) {
    if (!this.winston) this.setTraceId();
    this.winston.error(data);
  }

  debug(data) {
    if (!this.winston) this.setTraceId();
    this.winston.debug(data);
  }
};
