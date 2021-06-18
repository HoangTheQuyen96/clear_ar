const { CreatePromotion } = require("../../../../../configuration/application");
const { errorHelper } = require("../../../common/error-helper");

module.exports.createPromotionHandler = async function createPromotionHandler(call, callback) {
  const interactor = new CreatePromotion();
  try {
    const result = await interactor.execute(call.request);

    return callback(null, result);
  } catch (error) {
    call.logger.error(JSON.stringify(error.stack));
    return callback(errorHelper(error), null);
  }
};
