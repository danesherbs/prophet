import Expense from "../../src/expense";
import parser from "../../src/parsers/expense";

const expense = new Expense({
  yearlyIncrease: 0.03,
  weeklyAmount: 120,
  description: "Living expenses",
  initialTime: 0,
});

const data = JSON.parse(JSON.stringify(expense));

test("expense object is correctly parsed", () => {
  expect(parser(data)).toStrictEqual(expense);
});
