import Clock from "../../src/clock";
import parser from "../../src/parsers/clock";

const clock = new Clock(8);

const data = JSON.parse(JSON.stringify(clock));

test("clock object is correctly parsed", () => {
  expect(parser(data)).toStrictEqual(clock);
});
