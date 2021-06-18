const { createLogger, format, transports } = require("winston");

const { printf } = format;

const customFormat = printf((data) => {
  // eslint-disable-next-line no-shadow
  let logString = "";
  logString = `${data.timestamp}`;
  logString += `${data.jaegerTraceId || ""}`;
  logString += ` ${data.serviceName || ""}`;
  logString += ` TRACE_ID=${data.traceId || ""}`;
  logString += ` ${data.domainName || ""}`;
  logString += ` ${data.level}`;
  logString += ` ${data.stack || data.message || ""}`;
  return logString;
});

const config = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
  },
};

module.exports.Winston = (serverName = "", level = "debug", traceId = "", jaegerTraceId = "", domainName = "") =>
  createLogger({
    levels: config.levels,
    defaultMeta: {
      serviceName: serverName,
      traceId,
      domainName,
      jaegerTraceId,
    },
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.colorize({
        colors: config.colors,
      }),
      customFormat,
      format.errors({ stack: true }),
    ),
    transports: [new transports.Console({ level })],
  });
