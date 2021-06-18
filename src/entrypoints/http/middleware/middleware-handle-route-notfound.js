module.exports.middlewareHandleRouteNotFound = async (ctx, next) => {
  ctx.status = 404;
  ctx.body = "Resource not found";
  ctx.app.emit("error", "Resource not found", ctx);
  await next();
};
