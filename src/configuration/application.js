const { DataGateway } = require("./infrastructure");

const { CreatePromotion } = require("../application/usecases/create-promotion/interactor");

module.exports.CreatePromotion = class extends CreatePromotion {
  constructor() {
    super({
      infra: {
        dataGateway: new DataGateway(),
      },
    });
  }
};