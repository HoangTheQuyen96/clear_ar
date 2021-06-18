const { createPromotion } = require('./providers/methods/create-promotion')

/**
 * @typedef {import('./providers/mongodb/mongodb').MongoDb} MongoDb
 */

class DataGateway {
  /**
   * @param {Object} options
   * @param {Object} options.client
   * @param {MongoDb} options.client.mongoDb
   */
  constructor(options) {
    this.client = options.client;
  }
}


DataGateway.prototype.createPromotion = createPromotion;

module.exports.DataGateway = DataGateway;
