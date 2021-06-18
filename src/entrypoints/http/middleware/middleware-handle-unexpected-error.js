module.exports.middlewareHandleUnexpectedError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {

    console.log(error)
    if (error.expose) {
      ctx.status = error.status
      ctx.body = {
        errors: [{ code: error.status, message: error.message }],
      };
      ctx.app.emit("error", error, ctx);
    }
    else {
      ctx.body = "An unexpected error";
      ctx.app.emit("error", error, ctx);
    }
  }
};
