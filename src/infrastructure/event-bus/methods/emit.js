/* eslint-disable-next-line */
module.exports.emit = function (event, data) {
  /** @type {import('../event-bus').EventBus} */
  const self = this;

  const kafkaTopic = self.kafkaTopics[event];
  if (kafkaTopic) {
    const messageBuffer = Buffer.from(JSON.stringify(data));
    self.kafkaProducer.produce(kafkaTopic, null, messageBuffer, null, +new Date());
  }
};
