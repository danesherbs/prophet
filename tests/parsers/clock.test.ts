import Clock from "../../src/clock";
import parser from "../../src/parsers/clock";

const data = {
  time: 1,
};

test("clock object is correctly parsed", () => {
  expect(parser(data)).toEqual(new Clock(1));
});
