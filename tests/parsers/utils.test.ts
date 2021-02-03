import { getValueSafely } from "../../src/parsers/utils";

const mapping = new Map([["a", 1]]);

test("correct value is retrieved from object", () => {
  expect(getValueSafely(mapping, "a")).toStrictEqual(1);
});

test("error is thrown for non-existent key", () => {
  expect(() => getValueSafely(mapping, "c")).toThrowError(Error);
});
