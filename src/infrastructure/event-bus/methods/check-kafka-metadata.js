/* eslint-disable-next-line */
module.exports.checkKafkaMetadata = async function () {
  /** @type {import('../event-bus').EventBus} */
  const self = this;

  return new Promise((resolve, reject) => {
    self.kafkaProducer.getMetadata({}, (error, metadata) => {
      if (error) reject(error);

      Object.values(self.kafkaTopics).forEach((topic) => {
        const res = metadata.topics.filter((metadataTopic) => metadataTopic.name === topic);
        if (res.length === 0) {
          reject(new Error(`Not found topic "${topic}" kafka metadata`));
        }
      });

      return resolve();
    });
  });
};
