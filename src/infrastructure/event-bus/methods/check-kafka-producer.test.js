const { checkKafkaProducer } = require("./check-kafka-producer");

test("Should throw error if cannot produce message", async () => {
  const mockError = new Error("abc");
  const mockSelf = {
    kafkaProducer: {
      produce: jest.fn(() => {
        throw mockError;
      }),
    },
  };
  try {
    await checkKafkaProducer.bind(mockSelf)();
    expect(true).toBe(false);
  } catch (error) {
    expect(error).toEqual(mockError);
  }
});

test("Should resolve", async () => {
  const mockSelf = {
    kafkaProducer: {
      produce: jest.fn(),
    },
  };
  try {
    await checkKafkaProducer.bind(mockSelf)();
  } catch (error) {
    expect(true).toBe(false);
  }
});
