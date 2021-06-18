const { healthcheck } = require("./healthcheck");

test("Should call the services that are needed to check", async () => {
  const mockSelf = {
    checkKafkaMetadata: jest.fn(),
    checkKafkaProducer: jest.fn(),
    checkKafkaConsumer: jest.fn(),
  };

  await healthcheck.bind(mockSelf)();

  expect(mockSelf.checkKafkaMetadata).toBeCalled();
  expect(mockSelf.checkKafkaProducer).toBeCalled();
  expect(mockSelf.checkKafkaConsumer).toBeCalled();
});
