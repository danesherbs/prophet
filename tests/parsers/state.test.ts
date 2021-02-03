import Clock from "../../src/clock";
import Tax from "../../src/tax";
import Bank from "../../src/bank";
import Salary from "../../src/salary";
import House from "../../src/house";
import Stock from "../../src/stock";
import Super from "../../src/super";
import State from "../../src/state";
import Expense from "../../src/expense";

import parser from "../../src/parsers/state";

const clock = new Clock(0);

const tax = new Tax({
  incomeTaxBrackets: new Array([[0.0, 50_000], 0.0], [[50_001, Infinity], 0.2]),
  superTaxRate: 0.15,
  declared: new Array(),
  paid: new Array(),
});

const bank = new Bank({
  transactions: new Array(),
  yearlyInterestRate: 0.03,
});

const superan = new Super({
  tax: tax,
  transactions: new Array(),
  yearlyInterestRate: 0.1,
  contributionRate: 0.125,
});

const salary = new Salary({
  tax: tax,
  yearlyGrossSalary: 120_000,
  yearlySalaryIncrease: 0.05,
  creationTime: clock.getTime(),
});

const expense = new Expense({
  yearlyIncrease: 0.03,
  weeklyAmount: 240,
  description: "Living expenses",
  initialTime: clock.getTime(),
});

const house = new House({
  loan: 550_000,
  houseValue: 600_000,
  yearlyInterestRate: 0.03,
  yearlyAppreciationRate: 0.03,
  monthlyGrossRentalIncome: 2_500,
  yearlyRentalIncomeIncrease: 0.03,
  buildingDepreciationRate: 0.025,
  purchaseTime: 0,
});

const stock = new Stock({
  numberOfUnits: 10,
  pricePerUnit: 500,
  rateOfReturn: 0.1,
  initialTime: 0,
});

const state = new State({
  clock: clock,
  tax: tax,
  bank: bank,
  superan: superan,
  salary: salary,
  houses: { a: house, b: house },
  stocks: { a: stock, b: stock },
  expenses: { a: expense },
});

const data = JSON.parse(JSON.stringify(state));

test("state object is correctly parsed", () => {
  expect(parser(data)).toStrictEqual(state);
});
