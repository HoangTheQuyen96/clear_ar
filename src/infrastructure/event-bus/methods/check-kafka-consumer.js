const Kafka = require("node-rdkafka");

/* eslint-disable-next-line */
module.exports.checkKafkaConsumer = function () {
  /** @type {import('../event-bus').EventBus} */
  const self = this;

  return new Promise((resolve, reject) => {
    const topic = "healthCheck";
    const consumerOptions = {
      "group.id": "health-check",
      "metadata.broker.list": self.kafkaHost,
    };
    const consumerTopicOptions = { "auto.offset.reset": "earliest" };
    const kafkaConsumer = new Kafka.KafkaConsumer(consumerOptions, consumerTopicOptions);

    kafkaConsumer.connect();

    kafkaConsumer.on("ready", () => {
      try {
        kafkaConsumer.subscribe([topic]);
        kafkaConsumer.consume();
      } catch (error) {
        reject(error);
      }
    });

    kafkaConsumer.on("data", (data) => {
      const consumedData = data.value.toString();
      /**
       * This message is called by check-kafka-producer
       */
      if (consumedData !== "ok") {
        reject(new Error("Kafka consumer healthcheck message not match"));
      }
      kafkaConsumer.disconnect();
      resolve();
    });

    kafkaConsumer.on("event.error", (error) => {
      reject(error);
    });
  });
};
