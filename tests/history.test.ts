import Clock from "../src/clock";
import Tax from "../src/tax";
import Bank from "../src/bank";
import Salary from "../src/salary";
import House from "../src/house";
import Stock from "../src/stock";
import Super from "../src/super";
import State from "../src/state";
import Expense from "../src/expense";
import History, { Action } from "../src/history";

const clock = new Clock(0);

const tax = new Tax({
  incomeTaxBrackets: [
    [[0.0, 18_200], 0.0],
    [[18_201, 37_000], 0.19],
    [[37_001, 87_000], 0.325],
    [[87_001, 180_000], 0.37],
    [[180_001, Infinity], 0.45],
  ],
  superTaxRate: 0.15,
  declared: [],
  paid: [],
});

const bank = new Bank({
  transactions: [],
  yearlyInterestRate: 0.03,
});

const superan = new Super({
  tax: tax,
  transactions: [],
  yearlyInterestRate: 0.1,
  contributionRate: 0.125,
});

const salary = new Salary({
  tax: tax,
  yearlyGrossSalary: 340_000,
  yearlySalaryIncrease: 0.1,
  creationTime: clock.getTime(),
});

const expenses = {
  living: new Expense({
    yearlyIncrease: 0.03,
    weeklyAmount: 550,
    description: "Living expenses",
    initialTime: 0,
  }),
};

const houses = {
  main: new House({
    loan: 550_000,
    houseValue: 600_000,
    yearlyInterestRate: 0.03,
    yearlyAppreciationRate: 0.05,
    monthlyGrossRentalIncome: 2_500,
    yearlyRentalIncomeIncrease: 0.03,
    buildingDepreciationRate: 0.025,
    purchaseTime: 0,
  }),
};

const stocks = {
  ihvv: new Stock({
    numberOfUnits: 10,
    pricePerUnit: 500,
    rateOfReturn: 0.1,
    initialTime: 0,
  }),
};

const initialState = new State({
  clock: clock,
  tax: tax,
  bank: bank,
  superan: superan,
  salary: salary,
  houses: houses,
  stocks: stocks,
  expenses: expenses,
});

const history = new History({
  history: Array.from(Array(121).keys())
    .map(() => initialState)
    .map((state, idx, arr) => (idx > 0 ? arr[idx - 1].waitOneMonth() : state)),
  events: Array.from(Array(121).keys()).map(() => []),
});

test("bank balance is growing over time", () => {
  const newExpense = new Expense({
    yearlyIncrease: 0.1,
    weeklyAmount: 1_000,
    description: "Dog expenses",
    initialTime: 0,
  });

  expect(history.getState(0).getBank().getBalance(0)).toEqual(0);

  expect(history.getState(0).getBank().getBalance(0)).toBeLessThan(
    history.getState(12).getBank().getBalance(12)
  );
});

test("adding expense applies to first and last states in history", () => {
  const newExpense = new Expense({
    yearlyIncrease: 0.1,
    weeklyAmount: 1_000,
    description: "New expenses",
    initialTime: 0,
  });

  // Added to start
  expect(
    history
      .addEvent({
        time: 0,
        event: {
          action: Action.Start,
          item: {
            id: "new expense",
            object: newExpense,
          },
        },
      })
      .getState(0)
      .getExpenses()
  ).toEqual({ ...expenses, "new expense": newExpense });

  // And end
  expect(
    history
      .addEvent({
        time: 120,
        event: {
          action: Action.Start,
          item: {
            id: "new expense",
            object: newExpense,
          },
        },
      })
      .getState(120)
      .getExpenses()
  ).toEqual({ ...expenses, "new expense": newExpense });
});
