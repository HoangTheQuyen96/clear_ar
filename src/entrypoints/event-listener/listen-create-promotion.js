const { Consumer } = require("@finviet-promotion/rd-kafka-node");

const { CreatePromotion } = require("../../configuration/application");

class Listener {
  /**
   * @param {Object} options
   * @param {String} options.name
   * @param {String} options.host
   * @param {String} options.groupId
   * @param {String} options.topic
   * @param {Number} options.logger
   * @param {Number} options.connectTimeout
   */
  constructor({ host, groupId, topic, logger, connectTimeout }) {
    this.name = "ListenCreatePromotion";
    this.logger = logger;
    this.consumer = new Consumer({
      mode: "non-flowing",
      intervalFetchMessage: 1, // Only affect for non-flowing mode
      numMsgFetchPerTime: 1, // Only affect for non-flowing mode
      host,
      groupId,
      topic,
      connectTimeout,
      name: this.name,
      logger: this.logger,
    });
  }
}

/**
 * Start listen message from Kafka
 */
Listener.prototype.listen = function listen() {
  this.consumer.listen(this.msgHandler.bind(this));
};

/**
 * Handle message
 */
Listener.prototype.msgHandler = async function msgHandler(message) {
  try {
    const data = JSON.parse(message.value.toString());
    
    if (!data) {
      this.logger.debug(`${this.name} Invalid message ${message.value.toString()}`);
      return;
    }

    const interactor = new CreatePromotion();

    const result = await interactor.execute(data);

    this.logger.info(result)
  } catch (error) {
    this.logger.error(JSON.stringify(error.stack));
  }
};

/**
 * Export listener
 */
module.exports.ListenCreatePromotion = Listener;
