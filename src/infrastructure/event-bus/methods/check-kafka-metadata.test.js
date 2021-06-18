const { checkKafkaMetadata } = require("./check-kafka-metadata");

test("Should throw error if cannot get metadata", async () => {
  const mockError = new Error("abc");
  const mockSelf = {
    kafkaProducer: {
      getMetadata: jest.fn((any, callback) => {
        callback(mockError, {});
      }),
    },
  };

  try {
    await checkKafkaMetadata.bind(mockSelf)();
    expect(true).toBe(false);
  } catch (error) {
    expect(mockSelf.kafkaProducer.getMetadata).toBeCalled();
    expect(mockSelf.kafkaProducer.getMetadata.mock.calls[0][0]).toEqual({});
    expect(error).toEqual(mockError);
  }
});

test("Should throws error if topic not found in metadata", async () => {
  const mockSelf = {
    kafkaTopics: { a: "b", c: "d" },
    kafkaProducer: {
      getMetadata: jest.fn((any, callback) => {
        callback(null, { topics: [{ name: "b" }] });
      }),
    },
  };

  try {
    await checkKafkaMetadata.bind(mockSelf)();
    expect(true).toBe(false);
  } catch (error) {
    expect(mockSelf.kafkaProducer.getMetadata).toBeCalled();
    expect(mockSelf.kafkaProducer.getMetadata.mock.calls[0][0]).toEqual({});
    expect(error).toEqual(new Error('Not found topic "d" kafka metadata'));
  }
});

test("Should return data", async () => {
  const mockSelf = {
    kafkaTopics: {
      a: "b",
    },
    kafkaProducer: {
      getMetadata: jest.fn((any, callback) => {
        callback(null, { topics: [{ name: "b" }] });
      }),
    },
  };

  try {
    await checkKafkaMetadata.bind(mockSelf)();
    expect(mockSelf.kafkaProducer.getMetadata).toBeCalled();
    expect(mockSelf.kafkaProducer.getMetadata.mock.calls[0][0]).toEqual({});
  } catch (error) {
    expect(true).toBe(false);
  }
});
