/* eslint-disable-next-line */
module.exports.healthcheck = async function () {
  /** @type {import('../event-bus').EventBus} */
  const self = this;

  await self.checkKafkaMetadata();
  await self.checkKafkaProducer();
  await self.checkKafkaConsumer();
};
