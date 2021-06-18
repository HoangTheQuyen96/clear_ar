/**
 * @typedef {import('../../../configuration/infrastructure').DataGateway} DataGateway
 * @this DataGateway
 */

const { Promotion } = require("../../../../entities/promotion");

module.exports.createPromotion = async function ({ name, title, description, type, method }) {
    const { mongoDb: client } = this.client;

    const promoition = client.Promotion({ name, title, description, type, method });

    await promoition.save()
    

    return new Promotion(promoition);
};
