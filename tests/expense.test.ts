import Expense from "../src/expense";

const expense = new Expense({
  yearlyIncrease: 0.03,
  weeklyAmount: 120,
  initialTime: 0,
});

test("correct monthly expenses", () => {
  expect(expense.getMonthlyAmount(0)).toBeCloseTo((120 * 52) / 12, 10);
});

test("monthly expenses increasing yearly", () => {
  expect(expense.getMonthlyAmount(12)).toBeCloseTo(
    ((120 * 52) / 12) * 1.03,
    10
  );
  expect(expense.getMonthlyAmount(48)).toBeCloseTo(
    ((120 * 52) / 12) * Math.pow(1.03, 4),
    10
  );
});

test("correct monthly expenses when accounting for inflation", () => {
  const yearlyInflationRate = 0.03;

  expect(expense.getMonthlyAmount(0, yearlyInflationRate)).toBeCloseTo(
    expense.getMonthlyAmount(0, 0)
  );
  expect(expense.getMonthlyAmount(12, yearlyInflationRate)).toBeCloseTo(
    expense.getMonthlyAmount(12, 0) / Math.pow(1 + yearlyInflationRate, 1)
  );
  expect(expense.getMonthlyAmount(12, yearlyInflationRate)).toBeCloseTo(
    expense.getMonthlyAmount(12 * 10, 0) / Math.pow(1 + yearlyInflationRate, 10)
  );
});

test("correct weekly expenses when accounting for inflation", () => {
  const yearlyInflationRate = 0.03;

  expect(expense.getWeeklyAmount(0, yearlyInflationRate)).toBeCloseTo(
    expense.getWeeklyAmount(0, 0)
  );
  expect(expense.getWeeklyAmount(12, yearlyInflationRate)).toBeCloseTo(
    expense.getWeeklyAmount(12, 0) / (1 + yearlyInflationRate)
  );
});
