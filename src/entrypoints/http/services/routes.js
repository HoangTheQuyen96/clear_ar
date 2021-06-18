const route = require("koa-router");
const router = new route();

const { createPromotionHandler } = require("./handlers/create-promotion-handler");

router.post('/v1/promotions', createPromotionHandler)

module.exports = router;
