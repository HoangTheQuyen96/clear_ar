/**
 * @typedef {Object} MiddlewareConfig
 * @property {function} middleware
 * @property {Object} [service]
 * @property {string} [handlerName]
 */

const grpc = require("grpc");

// Services
const { promotionService } = require('./services/promotion/promotion')
// Middleware section
const { middlewareValidateRequest } = require("./middleware/middleware-validate-request");
const { middlewareMapWrapperValues } = require("./middleware/middleware-map-wrapper-values");
const { middlewareMapFieldMaskValues } = require("./middleware/middleware-map-field-mask-values");

module.exports.GRPCServer = class {
  constructor(options) {
    this.port = options.port || 3333;
    this.logger = options.logger;
    this.services = [promotionService];
  }

  listen() {
    try {
      this.server = new grpc.Server();
      this.loadServices();
      this.server.bind(`0.0.0.0:${this.port}`, grpc.ServerCredentials.createInsecure());
      this.server.start();
      this.logger.info(`Server started at port ${this.port}`);
    } catch (error) {
      this.logger.error(`Error on starting server ${JSON.stringify(error.stack)}`);
      process.kill(process.pid);
    }
  }

  loadServices() {
    try {
      const mapSchemaToRequest = [];
      this.services.forEach((svc) => {
        Object.keys(svc.handlers).forEach((key) => {
          if (!svc.schema[key]) {
            this.logger.error(`Schema not found for handler: ${key} - Terminate app`);
            process.kill(process.pid);
          }
          mapSchemaToRequest.push({
            service: svc,
            handlerName: key,
            middleware: (call, callback, next) => {
              call.schema = svc.schema[key];
              next();
            },
          });
        });
      });

      const mapLoggerToRequest = [];
      this.services.forEach((svc) => {
        Object.keys(svc.handlers).forEach((key) => {
          mapSchemaToRequest.push({
            service: svc,
            handlerName: key,
            middleware: (call, callback, next) => {
              call.logger = this.logger;
              next();
            },
          });
        });
      });

      this.loadMiddleware([
        ...mapSchemaToRequest,
        ...mapLoggerToRequest,
        { middleware: middlewareValidateRequest },
        { middleware: middlewareMapFieldMaskValues },
        { middleware: middlewareMapWrapperValues },
      ]);

      this.services.forEach((service) => this.server.addService(service.service, service.handlers));
    } catch (error) {
      this.logger.error(`Error during loading services ${JSON.stringify(error.stack)}`);
    }
  }

  loadMiddleware(loads) {
    /** @type {MiddlewareConfig} */
    let opt;
    while (loads.length) {
      opt = loads.pop();
      if (opt.handlerName) this.applyMiddleware(opt.service, opt.handlerName, opt.middleware);
      else if (opt.service)
        Object.entries(opt.service.handlers).forEach(([key]) => this.applyMiddleware(opt.service, key, opt.middleware));
      else {
        this.services.forEach((svc) =>
          Object.entries(svc.handlers).forEach(([key]) => this.applyMiddleware(svc, key, opt.middleware)),
        );
      }
    }
  }

  /**
   * Function to apply middleware to a specific handler in a service
   *
   * @param {object} service
   * @param {string} handlerName
   * @param {function} middleware
   */
  applyMiddleware(service, handlerName, middleware) {
    const handler = service.handlers[handlerName];
    service.handlers[handlerName] = (call, callback) => {
      middleware(call, callback, () => {
        handler(call, callback);
      });
    };
  }
};
