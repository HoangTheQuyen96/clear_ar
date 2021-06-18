jest.mock("node-rdkafka", () => ({
  KafkaConsumer: class {},
}));

const Kafka = require("node-rdkafka");

const { checkKafkaConsumer } = require("./check-kafka-consumer");

test("Should throw error if cannot consume", async () => {
  const mockError = new Error("abc");
  Kafka.KafkaConsumer.prototype.connect = jest.fn();
  Kafka.KafkaConsumer.prototype.subscribe = jest.fn(() => {
    throw mockError;
  });
  Kafka.KafkaConsumer.prototype.consume = jest.fn();
  Kafka.KafkaConsumer.prototype.on = jest.fn((event, callback) => {
    if (event === "ready") callback();
    if (event === "data") callback();
    if (event === "event.error") callback();
  });

  try {
    await checkKafkaConsumer.bind({
      logger: { log: jest.fn() },
      kafkaHost: "1",
    })();
    expect(true).toBe(false);
  } catch (error) {
    expect(error).toEqual(mockError);
  }
});

test("Should throw error if consume wrong message", async () => {
  Kafka.KafkaConsumer.prototype.connect = jest.fn();
  Kafka.KafkaConsumer.prototype.subscribe = jest.fn();
  Kafka.KafkaConsumer.prototype.consume = jest.fn();
  Kafka.KafkaConsumer.prototype.on = jest.fn((event, callback) => {
    if (event === "ready") callback();
    if (event === "data") callback({ value: "not-ok" });
    if (event === "event.error") callback();
  });

  try {
    await checkKafkaConsumer.bind({
      logger: { log: jest.fn() },
      kafkaHost: "1",
    })();
    expect(true).toBe(false);
  } catch (error) {
    expect(error).toEqual(new Error("Kafka consumer healthcheck message not match"));
  }
});

test("Should connect, consume and not throw error", async () => {
  Kafka.KafkaConsumer.prototype.connect = jest.fn();
  Kafka.KafkaConsumer.prototype.disconnect = jest.fn();
  Kafka.KafkaConsumer.prototype.subscribe = jest.fn();
  Kafka.KafkaConsumer.prototype.consume = jest.fn();
  Kafka.KafkaConsumer.prototype.on = jest.fn((event, callback) => {
    if (event === "ready") callback();
    if (event === "data") callback({ value: "ok" });
    if (event === "event.error") callback();
  });

  try {
    await checkKafkaConsumer.bind({
      logger: { log: jest.fn() },
      kafkaHost: "1",
    })();
    expect(Kafka.KafkaConsumer.prototype.connect).toBeCalled();
    expect(Kafka.KafkaConsumer.prototype.subscribe).toBeCalled();
    expect(Kafka.KafkaConsumer.prototype.consume).toBeCalled();
    expect(Kafka.KafkaConsumer.prototype.on).toBeCalledTimes(3);
  } catch (error) {
    expect(true).toBe(false);
  }
});
