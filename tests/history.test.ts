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

test("retrieval of house with start time returns correct time", () => {
  expect(
    history
      .addEvent({
        time: 25,
        event: {
          action: Action.Add,
          item: {
            id: "new id",
            object: houses["main"],
          },
        },
      })
      .getStart({ id: "new id" })
  ).toEqual(25);
});

test("retrieval of house with no start time throws an error", () => {
  expect(() => history.getStart({ id: "new id" })).toThrowError(RangeError);
});

test("retrieval house with end time returns correct time", () => {
  expect(
    history
      .addEvent({
        time: 25,
        event: {
          action: Action.Add,
          item: {
            id: "new id",
            object: houses["main"],
          },
        },
      })
      .addEvent({
        time: 50,
        event: {
          action: Action.Sell,
          item: {
            id: "new id",
            object: houses["main"],
          },
        },
      })
      .getEnd({ id: "new id" })
  ).toEqual(50);
});

test("retrieval of house with no end time returns null", () => {
  expect(
    history
      .addEvent({
        time: 25,
        event: {
          action: Action.Add,
          item: {
            id: "new id",
            object: houses["main"],
          },
        },
      })
      .getEnd({ id: "new id" })
  ).toEqual(null);
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
          action: Action.Add,
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
          action: Action.Add,
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

test("adding event at time adds correct asset", () => {
  expect(
    history
      .addEvent({
        time: 0,
        event: {
          action: Action.Add,
          item: {
            id: "new id",
            object: houses["main"],
          },
        },
      })
      .getState(30)
      .getHouses()
  ).toEqual({ ...houses, "new id": houses["main"] });
});

test("adding and removing event doesn't alter original state", () => {
  expect(
    history
      .addEvent({
        time: 25,
        event: {
          action: Action.Add,
          item: {
            id: "new id",
            object: houses["main"],
          },
        },
      })
      .removeEvent({
        time: 25,
        id: "new id",
        action: Action.Add,
      })
      .getState(25)
  ).toEqual(history.getState(25));
});

test("adding and removing multiple events doesn't alter original state", () => {
  expect(
    history
      .addEvent({
        time: 25,
        event: {
          action: Action.Add,
          item: {
            id: "new stock",
            object: stocks["ihvv"],
          },
        },
      })
      .addEvent({
        time: 50,
        event: {
          action: Action.Buy,
          item: {
            id: "new house",
            object: houses["main"],
          },
        },
      })
      .removeEvent({
        time: 25,
        id: "new stock",
        action: Action.Add,
      })
      .removeEvent({
        time: 50,
        id: "new house",
        action: Action.Buy,
      })
      .getState(100)
  ).toEqual(history.getState(100));
});

test("removing events are idempotent", () => {
  expect(
    history
      .addEvent({
        time: 50,
        event: {
          action: Action.Buy,
          item: {
            id: "new id",
            object: houses["main"],
          },
        },
      })
      .removeEvent({
        time: 50,
        id: "new id",
        action: Action.Add,
      })
      .removeEvent({
        time: 50,
        id: "new id",
        action: Action.Buy,
      })
      .getState(100)
  ).toEqual(history.getState(100));
});

test("removing non-existent event has no effect", () => {
  expect(
    history
      .addEvent({
        time: 50,
        event: {
          action: Action.Buy,
          item: {
            id: "new id",
            object: houses["main"],
          },
        },
      })
      .removeEvent({
        time: 50,
        id: "new id",
        action: Action.Sell,
      })
      .removeEvent({
        time: 25,
        id: "new id",
        action: Action.Buy,
      })
      .getState(100)
  ).toEqual(history.getState(100));
});

test("removing events are idempotent", () => {
  expect(
    history
      .addEvent({
        time: 50,
        event: {
          action: Action.Buy,
          item: {
            id: "new id",
            object: houses["main"],
          },
        },
      })
      .removeEvent({
        time: 50,
        id: "new id",
        action: Action.Add,
      })
      .removeEvent({
        time: 50,
        id: "new id",
        action: Action.Buy,
      })
      .getState(100)
  ).toEqual(history.getState(100));
});

test("setting start of existing house sets to correct value", () => {
  expect(
    history
      .addEvent({
        time: 50,
        event: {
          action: Action.Buy,
          item: {
            id: "new id",
            object: houses["main"],
          },
        },
      })
      .setStart({ time: 75, id: "new id", item: houses["main"] })
      .getStart({ id: "new id" })
  ).toEqual(75);
});

test("setting end of existing house sets to correct value", () => {
  expect(
    history
      .addEvent({
        time: 50,
        event: {
          action: Action.Buy,
          item: {
            id: "new id",
            object: houses["main"],
          },
        },
      })
      .setEnd({ time: 55, id: "new id", item: houses["main"] })
      .getEnd({ id: "new id" })
  ).toEqual(55);
});

test("deleting end of existing house sets end to null", () => {
  expect(
    history
      .addEvent({
        time: 50,
        event: {
          action: Action.Buy,
          item: {
            id: "new id",
            object: houses["main"],
          },
        },
      })
      .setEnd({ time: null, id: "new id", item: houses["main"] })
      .getEnd({ id: "new id" })
  ).toEqual(null);
});
