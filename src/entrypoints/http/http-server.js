const http = require("http");
const koa = require("koa");
const cors = require('@koa/cors');
const bodyParser = require('koa-body');
const { middlewareHandleRouteNotFound } = require("./middleware/middleware-handle-route-notfound");
const { middlewareHandleUnexpectedError } = require("./middleware/middleware-handle-unexpected-error");
const router = require("./services/routes");

module.exports.HTTPServer = class {
  constructor(options) {
    this.port = options.portHttp;
    this.logger = options.logger;
  }

  async listen() {
    this.app = new koa();
    this.router = router;

    this.app.use(async (ctx, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      ctx.set('X-Response-Time', ms);
    });
  
    this.app.use(cors());
  
    this.app.use(
      bodyParser({
        urlencoded: true,
      })
    );

    this.app.use(middlewareHandleUnexpectedError);

    this.app.use(this.router.routes());

    this.app.use(middlewareHandleRouteNotFound);

    this.app.on("error", (error) => {
      this.logger.error(error);
    });

    this.app.listen(process.env.ENTRYPOINT_HTTP_PORT)
  }
};
