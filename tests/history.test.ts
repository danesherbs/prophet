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

const house = new House({
  loan: 550_000,
  houseValue: 600_000,
  yearlyInterestRate: 0.03,
  yearlyAppreciationRate: 0.05,
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

const initialState = new State({
  clock: clock,
  tax: tax,
  bank: bank,
  superan: superan,
  salary: salary,
  houses: {},
  stocks: {},
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
            id: "A",
            object: house,
          },
        },
      })
      .getStart({ id: "A" })
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
            id: "A",
            object: house,
          },
        },
      })
      .addEvent({
        time: 50,
        event: {
          action: Action.Sell,
          item: {
            id: "A",
            object: house,
          },
        },
      })
      .getEnd({ id: "A" })
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
            id: "A",
            object: house,
          },
        },
      })
      .getEnd({ id: "A" })
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
            id: "A",
            object: house,
          },
        },
      })
      .getState(30)
      .getHouses()
  ).toEqual({ A: house });
});

test("adding and removing event doesn't alter original state", () => {
  expect(
    history
      .addEvent({
        time: 25,
        event: {
          action: Action.Add,
          item: {
            id: "A",
            object: house,
          },
        },
      })
      .removeEvent({
        time: 25,
        id: "A",
        action: Action.Add,
      })
      .getState(25)
  ).toEqual(history.getState(25));
});

test("adding and removing multiple events doesn't alter original state", () => {
  expect(
    history
      .addEvent({
        time: 5,
        event: {
          action: Action.Add,
          item: {
            id: "stock",
            object: stock,
          },
        },
      })
      .addEvent({
        time: 10,
        event: {
          action: Action.Buy,
          item: {
            id: "house",
            object: house,
          },
        },
      })
      .removeEvent({
        time: 5,
        id: "stock",
        action: Action.Add,
      })
      .removeEvent({
        time: 10,
        id: "house",
        action: Action.Buy,
      })
      .getState(15)
  ).toEqual(history.getState(15));
});

test("removing events are idempotent", () => {
  expect(
    history
      .addEvent({
        time: 5,
        event: {
          action: Action.Buy,
          item: {
            id: "A",
            object: house,
          },
        },
      })
      .removeEvent({
        time: 5,
        id: "A",
        action: Action.Add,
      })
      .removeEvent({
        time: 5,
        id: "A",
        action: Action.Buy,
      })
      .getState(10)
  ).toEqual(history.getState(10));
});

test("removing non-existent event has no effect", () => {
  expect(
    history
      .addEvent({
        time: 10,
        event: {
          action: Action.Buy,
          item: {
            id: "A",
            object: house,
          },
        },
      })
      .removeEvent({
        time: 10,
        id: "A",
        action: Action.Sell,
      })
      .removeEvent({
        time: 5,
        id: "A",
        action: Action.Buy,
      })
      .getState(15)
  ).toEqual(
    history
      .addEvent({
        time: 10,
        event: {
          action: Action.Buy,
          item: {
            id: "A",
            object: house,
          },
        },
      })
      .getState(15)
  );
});

test("setting start of existing house sets to correct value", () => {
  expect(
    history
      .addEvent({
        time: 5,
        event: {
          action: Action.Buy,
          item: {
            id: "A",
            object: house,
          },
        },
      })
      .setStart({ time: 10, id: "A", item: house })
      .getStart({ id: "A" })
  ).toEqual(10);
});

test("setting start of multiple houses sets correct times", () => {
  const newHistory = history
    .addEvent({
      time: 5,
      event: {
        action: Action.Add,
        item: {
          id: "A",
          object: house,
        },
      },
    })
    .addEvent({
      time: 5,
      event: {
        action: Action.Buy,
        item: {
          id: "B",
          object: house,
        },
      },
    })
    .setStart({ time: 5, id: "A", item: house })
    .setStart({ time: 10, id: "B", item: house });

  expect(newHistory.getStart({ id: "A" })).toEqual(5);
  expect(newHistory.getStart({ id: "B" })).toEqual(10);
});

test("adding and removing event results in original event list", () => {
  const newHistory = history
    .addEvent({
      time: 50,
      event: {
        action: Action.Add,
        item: {
          id: "A",
          object: house,
        },
      },
    })
    .removeEvent({
      time: 50,
      id: "A",
      action: Action.Add,
    });

  expect(newHistory.getEvents()).toEqual(newHistory.getEvents());
});

test("adding two houses and removing one results in singleton event list", () => {
  const newHistory = history
    .addEvent({
      time: 0,
      event: {
        action: Action.Add,
        item: {
          id: "A",
          object: house,
        },
      },
    })
    .addEvent({
      time: 0,
      event: {
        action: Action.Buy,
        item: {
          id: "B",
          object: house,
        },
      },
    })
    .removeEvent({
      time: 0,
      id: "A",
      action: Action.Add,
    });

  const [, ...tail] = newHistory.getEvents();

  expect(newHistory.getEvents()).toEqual([
    [{ action: Action.Buy, item: { id: "B", object: house } }],
    ...tail,
  ]);
});

test("setting start of existing house at same time overwrites exiting house", () => {
  const house = new House({
    loan: 550_000,
    houseValue: 700_000,
    yearlyInterestRate: 0.03,
    yearlyAppreciationRate: 0.05,
    monthlyGrossRentalIncome: 2_500,
    yearlyRentalIncomeIncrease: 0.03,
    buildingDepreciationRate: 0.025,
    purchaseTime: 0,
  });

  expect(
    history
      .addEvent({
        time: 50,
        event: {
          action: Action.Buy,
          item: {
            id: "A",
            object: house,
          },
        },
      })
      .setStart({ time: 50, id: "A", item: house })
      .getItem({ time: 50, id: "A" })
  ).toEqual(house);
});

test("setting end of existing house sets to correct value", () => {
  expect(
    history
      .addEvent({
        time: 50,
        event: {
          action: Action.Buy,
          item: {
            id: "A",
            object: house,
          },
        },
      })
      .setEnd({ time: 55, id: "A", item: house })
      .getEnd({ id: "A" })
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
            id: "A",
            object: house,
          },
        },
      })
      .setEnd({ time: null, id: "A", item: house })
      .getEnd({ id: "A" })
  ).toEqual(null);
});

test("getter for multiple houses retrieves all houses", () => {
  expect(
    history
      .addEvent({
        time: 50,
        event: {
          action: Action.Buy,
          item: {
            id: "A",
            object: house,
          },
        },
      })
      .addEvent({
        time: 75,
        event: {
          action: Action.Buy,
          item: {
            id: "B",
            object: house,
          },
        },
      })
      .getHouses()
  ).toEqual(
    new Map([
      ["A", house],
      ["B", house],
    ])
  );
});
