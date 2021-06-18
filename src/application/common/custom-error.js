module.exports.CustomError = class extends Error {
  constructor(customErrorEnum, message, error) {
    super(message);
    this.code = customErrorEnum.errorCode;
    this.expose = true
    this.statusCode = customErrorEnum.statusCode
    this.status = customErrorEnum.status

    if (error && error.stack) {
      let trace = "";
      trace += this.stack.split("\n")[0];
      trace += `\n${this.stack.split("\n")[1]}`;
      trace += `\n${error.stack}`;
      this.stack = trace;
    }
  }
};
