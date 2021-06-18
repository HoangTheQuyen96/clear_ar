jest.mock("./methods/healthcheck");
jest.mock("./methods/check-kafka-metadata");
jest.mock("./methods/check-kafka-producer");
jest.mock("./methods/check-kafka-consumer");
jest.mock("./methods/emit");

const { EventBus } = require("./event-bus");

test("Should be initiated and expose needed methods for other module", () => {
  const mockInject = {
    infra: {
      kafkaHost: "",
      kafkaProducer: "",
      kafkaTopics: "",
      logger: "",
    },
  };
  const eventBus = new EventBus(mockInject);

  expect(eventBus.checkKafkaMetadata).toBeTruthy();
  expect(eventBus.checkKafkaProducer).toBeTruthy();
  expect(eventBus.checkKafkaConsumer).toBeTruthy();
  expect(eventBus.healthcheck).toBeTruthy();
  expect(eventBus.emit).toBeTruthy();
});
