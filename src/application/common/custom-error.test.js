const { CustomError } = require("./custom-error");

test("Can extends and keep the stack trace from original error", () => {
  const originalError = new Error("ABC");
  originalError.stack = ["custom trace"];
  const error = new CustomError("abc", "123", originalError);

  expect(error).toBeTruthy();
  expect(error.message).toBe("123");
  expect(error.stack.includes("custom trace")).toBe(true);
});
