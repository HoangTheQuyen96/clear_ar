const path = require("path");

const { createPromotionHandler } = require("./handlers/create-promotion-handler");


const { loadProto } = require("../../common/load-proto");
const { buildSchema } = require("../../common/build-schema");

const protoFile = path.join(__dirname, "../../protos/openapis/promotion/v1/promotion.proto");
const externalProtoDirs = [path.join(__dirname, "../..", "protos/openapis")];
const proto = loadProto(protoFile, externalProtoDirs);
const { service } = proto.openapis.promotion.v1.PromotionService;

module.exports.promotionService = {
  service,
  schema: buildSchema(protoFile, service),
  handlers: {
    CreatePromotion: createPromotionHandler,
  },
};
