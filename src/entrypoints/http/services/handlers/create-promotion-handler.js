const { CreatePromotion } = require("../../../../configuration/application");

module.exports.createPromotionHandler = async (ctx) => {
  try {
    console.log('xxxx')
    const interactor = new CreatePromotion();

    const result = await interactor.execute(ctx.request.body);

    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(error);
  }
};
