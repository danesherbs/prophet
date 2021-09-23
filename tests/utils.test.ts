import { toMonthlyRate, toWeeklyRate } from "../src/utils";

test("correct monthly rate given yearly rate", () => {
  expect(Math.pow(1 + toMonthlyRate(0.03), 12)).toBeCloseTo(1.03);
});

test("correct weekly rate given yearly rate", () => {
  expect(Math.pow(1 + toWeeklyRate(0.03), 52)).toBeCloseTo(1.03);
});
