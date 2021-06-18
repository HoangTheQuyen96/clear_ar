const { emit } = require("./emit");

test("Should send message of supported event", () => {
  const mockSelf = {
    kafkaTopics: { abc: "def" },
    kafkaProducer: {
      produce: jest.fn(),
    },
  };
  emit.bind(mockSelf)("abc", { a: "a" });

  expect(mockSelf.kafkaProducer.produce.mock.calls[0][0]).toBe("def");
  expect(mockSelf.kafkaProducer.produce.mock.calls[0][1]).toBe(null);
  expect(mockSelf.kafkaProducer.produce.mock.calls[0][2].toString()).toBe(JSON.stringify({ a: "a" }));
  expect(typeof mockSelf.kafkaProducer.produce.mock.calls[0][4]).toBe("number");
});

test("Should do nothing if not support topic", () => {
  const mockSelf = {
    kafkaTopics: { abc: "def" },
    kafkaProducer: {
      produce: jest.fn(),
    },
  };
  emit.bind(mockSelf)("abc2", { a: "a" });

  expect(mockSelf.kafkaProducer.produce).not.toBeCalled();
});
