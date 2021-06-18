/* eslint-disable-next-line */
module.exports.checkKafkaProducer = async function () {
  /** @type {import('../event-bus').EventBus} */
  const self = this;

  return new Promise((resolve, reject) => {
    const topic = "healthCheck";
    const message = "ok";
    const bufferMessage = Buffer.from(message);

    try {
      self.kafkaProducer.produce(topic, null, bufferMessage, null, Date.now());
      resolve("");
    } catch (error) {
      reject(error);
    }
  });
};
