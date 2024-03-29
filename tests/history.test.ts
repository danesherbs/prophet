import Clock from "../src/clock";
import Tax from "../src/tax";
import Bank from "../src/bank";
import Salary from "../src/salary";
import House from "../src/house";
import Stock from "../src/stock";
import Super from "../src/super";
import Expense from "../src/expense";
import History, { Action, Event } from "../src/history";
import State from "../src/state";
import Loan from "../src/loan";

const clock = new Clock(0);

const tax = new Tax({
  incomeTaxBrackets: [
    [[0.0, 18_200], 0.0],
    [[18_201, 37_000], 0.19],
    [[37_001, 87_000], 0.325],
    [[87_001, 180_000], 0.37],
    [[180_001, null], 0.45],
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
  transactions: [],
  yearlyInterestRate: 0.1,
  contributionRate: 0.125,
});

const salary = new Salary({
  yearlyGrossSalary: 340_000,
  yearlySalaryIncrease: 0.1,
});

const expense = new Expense({
  yearlyIncrease: 0.03,
  weeklyAmount: 550,
  initialTime: 0,
});

const principalAndInterestLoan = new Loan({
  amountBorrowed: 550_000,
  yearlyInterestRate: 0.03,
  monthlyFee: 30,
  isInterestOnly: false,
  lengthOfLoanInMonths: 12 * 30,
});

const houseWithPrincipalAndInterestLoan = new House({
  loan: principalAndInterestLoan,
  houseValue: 600_000,
  yearlyAppreciationRate: 0.05,
  monthlyGrossRentalIncome: 2_500,
  yearlyRentalIncomeIncrease: 0.03,
  buildingDepreciationRate: 0.025,
});

const interestOnlyLoan = new Loan({
  amountBorrowed: 550_000,
  yearlyInterestRate: 0.03,
  monthlyFee: 30,
  isInterestOnly: true,
  lengthOfLoanInMonths: 12 * 30,
});

const houseWithInterestOnlyLoan = new House({
  loan: interestOnlyLoan,
  houseValue: 600_000,
  yearlyAppreciationRate: 0.05,
  monthlyGrossRentalIncome: 2_500,
  yearlyRentalIncomeIncrease: 0.03,
  buildingDepreciationRate: 0.025,
});

const stock = new Stock({
  numberOfUnits: 10,
  pricePerUnit: 500,
  rateOfReturn: 0.1,
});

const start = new Date(2020, 0);

const history = new History({ events: {} })
  .addEvent({
    date: start,
    event: {
      action: Action.AddTax,
      item: { id: "tax", object: tax.getProps() },
    },
  })
  .addEvent({
    date: start,
    event: {
      action: Action.AddSuper,
      item: { id: "superan", object: superan.getProps() },
    },
  })
  .addEvent({
    date: start,
    event: {
      action: Action.AddBank,
      item: { id: "bank", object: bank.getProps() },
    },
  })
  .addEvent({
    date: start,
    event: {
      action: Action.AddSalary,
      item: { id: "salary", object: salary.getProps() },
    },
  });

test("adding event adds correct event", () => {
  const date = new Date(2020, 0, 5);

  const event = {
    action: Action.AddSalary,
    item: { id: "salary", object: salary },
  };

  expect(
    new History({ events: {} }).addEvent({ date, event }).getEvents()
  ).toEqual(new Map([[new Date(2020, 0).getTime(), new Set([event])]]));
});

test("singleton event is applied correctly", () => {
  const state = new State({
    clock: clock,
    tax: new Map(),
    banks: new Map(),
    superans: new Map(),
    salaries: new Map(),
    houses: new Map(),
    stocks: new Map(),
    expenses: new Map(),
    loans: new Map(),
  });

  const event = {
    action: Action.AddSalary,
    item: { id: "salary", object: salary },
  };

  expect(history.applyEvent({ state, event })).toEqual(
    state.addSalary({ id: "salary", salary: event.item.object })
  );
});

test("multiple events are applied correctly", () => {
  const state = new State({
    clock: clock,
    tax: new Map(),
    banks: new Map(),
    superans: new Map(),
    salaries: new Map(),
    houses: new Map(),
    stocks: new Map(),
    expenses: new Map(),
    loans: new Map(),
  });

  const addTaxEvent = {
    action: Action.AddTax,
    item: { id: "tax", object: tax },
  };

  const addSalaryEvent = {
    action: Action.AddSalary,
    item: { id: "salary", object: salary },
  };

  const buyHouseEvent = {
    action: Action.BuyHouse,
    item: { id: "house", object: houseWithPrincipalAndInterestLoan },
  };

  const addExpenseEvent = {
    action: Action.AddExpense,
    item: { id: "expense", object: expense },
  };

  expect(
    history.applyEvents({
      state,
      events: new Set([
        addTaxEvent,
        addSalaryEvent,
        buyHouseEvent,
        addExpenseEvent,
      ]),
    })
  ).toEqual(
    state
      .addTax({
        id: addTaxEvent.item.id,
        tax: addTaxEvent.item.object,
      })
      .addSalary({
        id: addSalaryEvent.item.id,
        salary: addSalaryEvent.item.object,
      })
      .buyHouse({
        id: buyHouseEvent.item.id,
        house: buyHouseEvent.item.object,
      })
      .addExpense({
        id: addExpenseEvent.item.id,
        expense: addExpenseEvent.item.object,
      })
  );
});

test("history with singleton event has non-empty events mapping", () => {
  const date = new Date(2020, 0, 10);

  const event = {
    action: Action.AddSalary,
    item: { id: "salary", object: salary },
  };

  expect(
    new History({ events: {} }).addEvent({ date, event }).getEvents()
  ).toEqual(new Map([[new Date(2020, 0).getTime(), new Set([event])]]));
});

test("event can be retrieved from map", () => {
  const date = new Date(2020, 0);

  const event = {
    action: Action.AddSalary,
    item: { id: "salary", object: salary },
  };

  expect(
    new History({ events: {} })
      .addEvent({ date, event })
      .getEvents()
      .get(new Date(2020, 0).getTime())
  ).toEqual(new Set([event]));
});

test("history with required events has non-empty states array", () => {
  expect(history.getStates({ horizonInMonths: 120 }).length).toBeGreaterThan(0);
});

test("creating history without minimum events throws error", () => {
  expect(() =>
    new History({ events: {} }).getStates({ horizonInMonths: 120 })
  ).toThrowError(Error);
});

test("bank balance is growing over time", () => {
  expect(history.getState(0).getSingletonBank().getBalance(0)).toEqual(0);
  expect(history.getState(0).getSingletonBank().getBalance(0)).toBeLessThan(
    history.getState(12).getSingletonBank().getBalance(12)
  );
});

test("retrieval of house with start time returns correct time", () => {
  expect(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.AddHouse,
          item: {
            id: "A",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .getStart({ id: "A" })
  ).toEqual(new Date(2020, 0));
});

test("retrieval of house with no start time returns null", () => {
  expect(history.getStart({ id: "new id" })).toEqual(null);
});

test("retrieval house with end time returns correct time", () => {
  expect(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.BuyHouse,
          item: {
            id: "A",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .addEvent({
        date: new Date(2021, 0, 1),
        event: {
          action: Action.SellHouse,
          item: {
            id: "A",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .getEnd({ id: "A" })
  ).toEqual(new Date(2021, 0));
});

test("retrieval of house with no end time returns null", () => {
  expect(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.BuyHouse,
          item: {
            id: "A",
            object: houseWithPrincipalAndInterestLoan,
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
    initialTime: 0,
  });

  // Added to start
  expect(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.AddExpense,
          item: {
            id: "new expense",
            object: newExpense,
          },
        },
      })
      .getState(0)
      .getExpenses()
  ).toEqual(new Map([["new expense", newExpense]]));

  // And end
  expect(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.AddExpense,
          item: {
            id: "new expense",
            object: newExpense,
          },
        },
      })
      .getState(24)
      .getExpenses()
  ).toEqual(new Map([["new expense", newExpense]]));
});

test("adding event at time adds correct asset", () => {
  expect(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.AddHouse,
          item: {
            id: "house a",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .getState(5)
      .getHouses()
  ).toEqual(
    new Map([
      [
        "house a",
        houseWithPrincipalAndInterestLoan
          .waitOneMonth()
          .waitOneMonth()
          .waitOneMonth()
          .waitOneMonth()
          .waitOneMonth(),
      ],
    ])
  );
});

test("adding and removing event doesn't alter original state", () => {
  expect(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.BuyHouse,
          item: {
            id: "A",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .removeEvent({
        date: new Date(2020, 0),
        id: "A",
      })
      .getState(25)
  ).toEqual(history.getState(25));
});

test("adding and removing multiple events doesn't alter original state", () => {
  expect(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.AddStock,
          item: {
            id: "stock",
            object: stock,
          },
        },
      })
      .addEvent({
        date: new Date(2021, 0, 1),
        event: {
          action: Action.BuyHouse,
          item: {
            id: "house",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .removeEvent({
        date: new Date(2020, 0),
        id: "stock",
      })
      .removeEvent({
        date: new Date(2021, 0, 1),
        id: "house",
      })
      .getState(15)
  ).toEqual(history.getState(15));
});

test("removing events are idempotent", () => {
  expect(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.BuyHouse,
          item: {
            id: "A",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .removeEvent({
        date: new Date(2020, 0),
        id: "A",
      })
      .removeEvent({
        date: new Date(2020, 0),
        id: "A",
      })
      .getState(10)
  ).toEqual(history.getState(10));
});

test("removing non-existent event has no effect", () => {
  expect(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.BuyHouse,
          item: {
            id: "A",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .removeEvent({
        date: new Date(2021, 0, 1),
        id: "A",
      })
      .getState(15)
  ).toEqual(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.BuyHouse,
          item: {
            id: "A",
            object: houseWithPrincipalAndInterestLoan,
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
        date: new Date(2020, 0),
        event: {
          action: Action.BuyHouse,
          item: {
            id: "A",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .setStart({
        id: "A",
        date: new Date(2021, 0, 1),
      })
      .getStart({ id: "A" })
  ).toEqual(new Date(2021, 0, 1));
});

test("setting start of multiple houses sets correct times", () => {
  const newHistory = history
    .addEvent({
      date: new Date(2020, 0),
      event: {
        action: Action.AddHouse,
        item: {
          id: "A",
          object: houseWithPrincipalAndInterestLoan,
        },
      },
    })
    .addEvent({
      date: new Date(2020, 0),
      event: {
        action: Action.BuyHouse,
        item: {
          id: "B",
          object: houseWithPrincipalAndInterestLoan,
        },
      },
    })
    .setStart({
      id: "A",
      date: new Date(2020, 0),
    })
    .setStart({
      id: "B",
      date: new Date(2021, 0, 1),
    });

  expect(newHistory.getStart({ id: "A" })).toEqual(new Date(2020, 0));
  expect(newHistory.getStart({ id: "B" })).toEqual(new Date(2021, 0, 1));
});

test("adding and removing event results in original event list", () => {
  const newHistory = history
    .addEvent({
      date: new Date(2020, 0),
      event: {
        action: Action.AddHouse,
        item: {
          id: "A",
          object: houseWithPrincipalAndInterestLoan,
        },
      },
    })
    .removeEvent({
      date: new Date(2020, 0),
      id: "A",
    });

  expect(newHistory.getEvents()).toEqual(newHistory.getEvents());
});

test("adding two houses and removing one results in singleton event list", () => {
  expect(
    new History({ events: {} })
      .addEvent({
        date: new Date(2020, 0, 5),
        event: {
          action: Action.AddHouse,
          item: {
            id: "A",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .addEvent({
        date: new Date(2020, 0, 10),
        event: {
          action: Action.BuyHouse,
          item: {
            id: "B",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .removeEvent({
        date: new Date(2020, 0, 3),
        id: "A",
      })
      .getEvents()
  ).toEqual(
    new Map([
      [
        new Date(2020, 0).getTime(),
        new Set([
          {
            action: Action.BuyHouse,
            item: { id: "B", object: houseWithPrincipalAndInterestLoan },
          },
        ]),
      ],
    ])
  );
});

test("setting start of existing house at same time overwrites exiting house", () => {
  const house = new House({
    loan: principalAndInterestLoan,
    houseValue: 700_000,
    yearlyAppreciationRate: 0.05,
    monthlyGrossRentalIncome: 2_500,
    yearlyRentalIncomeIncrease: 0.03,
    buildingDepreciationRate: 0.025,
  });

  expect(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.BuyHouse,
          item: {
            id: "A",
            object: house,
          },
        },
      })
      .setStart({
        id: "A",
        date: new Date(2021, 0, 1),
      })
      .getEvent({ date: new Date(2021, 0, 1), id: "A" })
  ).toEqual({ action: Action.BuyHouse, item: { id: "A", object: house } });
});

test("setting end of existing house sets to correct value", () => {
  expect(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.BuyHouse,
          item: {
            id: "A",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .addEvent({
        date: new Date(2021, 0, 1),
        event: {
          action: Action.SellHouse,
          item: {
            id: "A",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .setEnd({
        id: "A",
        date: new Date(2022, 0, 1),
      })
      .getEnd({ id: "A" })
  ).toEqual(new Date(2022, 0, 1));
});

test("deleting end of existing house sets end to null", () => {
  expect(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.BuyHouse,
          item: {
            id: "A",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .removeEvent({ date: new Date(2020, 0), id: "A" })
      .getEnd({ id: "A" })
  ).toEqual(null);
});

test("getter for multiple houses retrieves all houses", () => {
  expect(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.BuyHouse,
          item: {
            id: "A",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .addEvent({
        date: new Date(2021, 0, 1),
        event: {
          action: Action.AddHouse,
          item: {
            id: "B",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .getHouses()
  ).toEqual(
    new Map([
      ["A", houseWithPrincipalAndInterestLoan],
      ["B", houseWithPrincipalAndInterestLoan],
    ])
  );
});

test("getter for multiple stocks retrieves all stocks", () => {
  expect(
    history
      .addEvent({
        date: new Date(2020, 0),
        event: {
          action: Action.BuyStock,
          item: {
            id: "A",
            object: stock,
          },
        },
      })
      .addEvent({
        date: new Date(2021, 0, 1),
        event: {
          action: Action.AddStock,
          item: {
            id: "B",
            object: stock,
          },
        },
      })
      .getStocks()
  ).toEqual(
    new Map([
      ["A", stock],
      ["B", stock],
    ])
  );
});

test("able to save and load history", () => {
  expect(
    JSON.stringify(History.fromJSON(JSON.parse(history.toString())))
  ).toEqual(JSON.stringify(history));
});

test("setting start and end and setting start again gives correct start and end", () => {
  const historyWithHouse = history
    .setStart({
      id: "new house",
      date: new Date("2021-1-1"),
      startEvent: {
        action: Action.AddHouse,
        item: {
          id: "new house",
          object: houseWithPrincipalAndInterestLoan,
        },
      },
    })
    .setEnd({
      id: "new house",
      date: new Date("2027-1-1"),
      endEvent: {
        action: Action.SellHouse,
        item: {
          id: "new house",
          object: houseWithPrincipalAndInterestLoan,
        },
      },
    })
    .setStart({
      id: "new house",
      date: new Date("2022-1-1"),
      startEvent: {
        action: Action.AddHouse,
        item: {
          id: "new house",
          object: houseWithPrincipalAndInterestLoan.getProps(),
        },
      },
    });

  expect(historyWithHouse.getStart({ id: "new house" })).toEqual(
    new Date("2022-1-1")
  );

  expect(historyWithHouse.getEnd({ id: "new house" })).toEqual(
    new Date("2027-1-1")
  );
});

test("refinancing house a few years in replaces it with correct loan", () => {
  const historyWithHouse = history.setStart({
    id: "new house",
    date: start,
    startEvent: {
      action: Action.AddHouse,
      item: {
        id: "new house",
        object: houseWithPrincipalAndInterestLoan.getProps(),
      },
    },
  });

  const historyWithHouseAndRefinance = historyWithHouse.addEvent({
    date: start,
    event: {
      action: Action.RefinanceHouse,
      item: {
        id: "new house",
        object: interestOnlyLoan.getProps(),
      },
    },
  });

  const states = historyWithHouseAndRefinance.getStates({
    horizonInMonths: 120,
  });

  // Check if additional event added
  expect(
    [...historyWithHouseAndRefinance.getEvents().values()].reduce(
      (acc, evts) => acc + evts.size,
      0
    )
  ).toEqual(
    [...historyWithHouse.getEvents().values()].reduce(
      (acc, evts) => acc + evts.size,
      0
    ) + 1
  );
  expect(states[0].getHouses().size).toEqual(1);
  expect(states[0].getHouses().get("new house")?.getLoan()).toEqual(
    interestOnlyLoan
  );
  expect(
    historyWithHouse
      .getState(12 * 5)
      .getHouses()
      .get("new house")
      ?.getLoan() ===
      historyWithHouseAndRefinance
        .getState(12 * 5)
        .getHouses()
        .get("new house")
        ?.getLoan()
  ).toBeFalsy();
});

test("creating history with house, setting end date and pushing start date forward returns correct start and end dates", () => {
  const historyWithHouse = history
    .setStart({
      id: "new house",
      date: new Date(2021, 1, 1),
      startEvent: {
        action: Action.AddHouse,
        item: {
          id: "new house",
          object: houseWithPrincipalAndInterestLoan.getProps(),
        },
      },
    })
    .setEnd({
      id: "new house",
      date: new Date(2027, 1, 1),
      endEvent: {
        action: Action.SellHouse,
        item: {
          id: "new house",
          object: houseWithPrincipalAndInterestLoan.getProps(),
        },
      },
    })
    .setStart({
      id: "new house",
      date: new Date(2022, 1, 1),
      startEvent: {
        action: Action.AddHouse,
        item: {
          id: "new house",
          object: houseWithPrincipalAndInterestLoan.getProps(),
        },
      },
    })
    .setStart({
      id: "new house",
      date: new Date(2023, 1, 1),
      startEvent: {
        action: Action.AddHouse,
        item: {
          id: "new house",
          object: houseWithPrincipalAndInterestLoan.getProps(),
        },
      },
    });

  const states = historyWithHouse.getStates({ horizonInMonths: 120 });

  expect(historyWithHouse.getStart({ id: "new house" })).toEqual(
    new Date(2023, 1, 1)
  );

  expect(historyWithHouse.getEnd({ id: "new house" })).toEqual(
    new Date(2027, 1, 1)
  );

  expect(states[5 * 12].getHouses().size).toBeGreaterThan(0);
  expect(states[10 * 12].getHouses().size).toEqual(0);
});

test("check that history with single house has invalid dependency graph", () => {
  const invalidHistory = new History({ events: {} }).setStart({
    id: "house",
    date: new Date(2021, 0, 1),
    startEvent: {
      action: Action.AddHouse,
      item: {
        id: "new house",
        object: houseWithPrincipalAndInterestLoan.getProps(),
      },
    },
  });

  expect(invalidHistory.hasValidDependencyGraph()).toBeFalsy();
});

test("check that history with house added before bank has invalid dependency graph", () => {
  expect(
    history
      .addEvent({
        date: new Date(1950, 0, 1),
        event: {
          action: Action.BuyHouse,
          item: {
            id: "house",
            object: houseWithPrincipalAndInterestLoan.getProps(),
          },
        },
      })
      .hasValidDependencyGraph()
  ).toBeFalsy();
});

test("check that history with house added at same time as bank and tax has valid dependency graph", () => {
  expect(
    history
      .addEvent({
        date: start,
        event: {
          action: Action.BuyHouse,
          item: {
            id: "house",
            object: houseWithPrincipalAndInterestLoan.getProps(),
          },
        },
      })
      .hasValidDependencyGraph()
  ).toBeTruthy();
});

test("check that history with refinance for house after sell date has an invalid dependency graph", () => {
  expect(
    history
      .addEvent({
        date: start,
        event: {
          action: Action.BuyHouse,
          item: {
            id: "house",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .addEvent({
        date: new Date(2025, 1, 1),
        event: {
          action: Action.SellHouse,
          item: {
            id: "house",
            object: houseWithPrincipalAndInterestLoan,
          },
        },
      })
      .addEvent({
        date: new Date(2026, 1, 1),
        event: {
          action: Action.RefinanceHouse,
          item: {
            id: "house",
            object: interestOnlyLoan,
          },
        },
      })
      .hasValidDependencyGraph()
  ).toBeFalsy();
});

test("check dependecy graph is correct for stocks", () => {
  expect(
    history
      .addEvent({
        date: new Date(1950, 0, 1),
        event: {
          action: Action.BuyStock,
          item: { id: "stock", object: stock.getProps() },
        },
      })
      .hasValidDependencyGraph()
  ).toBeFalsy();

  expect(
    history
      .addEvent({
        date: new Date(2050, 0, 1),
        event: {
          action: Action.AddStock,
          item: { id: "stock", object: stock.getProps() },
        },
      })
      .hasValidDependencyGraph()
  ).toBeTruthy();
});

test("check dependecy graph is correct for expenses", () => {
  expect(
    history
      .addEvent({
        date: new Date(1950, 0, 1),
        event: {
          action: Action.AddExpense,
          item: { id: "expense", object: expense.getProps() },
        },
      })
      .hasValidDependencyGraph()
  ).toBeFalsy();

  expect(
    history
      .addEvent({
        date: new Date(2050, 0, 1),
        event: {
          action: Action.AddExpense,
          item: { id: "expense", object: expense.getProps() },
        },
      })
      .hasValidDependencyGraph()
  ).toBeTruthy();
});

test("check dependecy graph is correct for salaries", () => {
  expect(
    history
      .addEvent({
        date: new Date(1950, 0, 1),
        event: {
          action: Action.AddSalary,
          item: { id: "sidejob", object: salary.getProps() },
        },
      })
      .hasValidDependencyGraph()
  ).toBeFalsy();

  expect(
    history
      .addEvent({
        date: new Date(2050, 0, 1),
        event: {
          action: Action.AddSalary,
          item: { id: "sidejob", object: salary.getProps() },
        },
      })
      .hasValidDependencyGraph()
  ).toBeTruthy();
});

test("setting end to null deletes end", () => {
  const buyingDoggo = history
    .setStart({
      id: "dog",
      date: new Date(2020, 0, 1),
      startEvent: {
        action: Action.AddExpense,
        item: { id: "dog", object: expense.getProps() },
      },
    })
    .setEnd({
      id: "dog",
      date: new Date(2050, 0, 1),
      endEvent: {
        action: Action.RemoveExpense,
        item: { id: "dog", object: expense.getProps() },
      },
    });

  expect(buyingDoggo.getEnd({ id: "dog" })).toEqual(new Date(2050, 0, 1));

  expect(
    buyingDoggo.setEnd({ id: "dog", date: null }).getEnd({ id: "dog" })
  ).toEqual(null);
});

test("removing salary id actually removes id", () => {
  expect(history.removeId({ id: "salary" }).getStart({ id: "salary" })).toEqual(
    null
  );
});

test("setting start on existing object updates the object", () => {
  expect(
    history
      .setStart({
        id: "dog",
        date: new Date(2020, 0, 1),
        startEvent: {
          action: Action.AddExpense,
          item: { id: "dog", object: expense.getProps() },
        },
      })
      .setStart({
        id: "dog",
        date: new Date(2050, 0, 1),
        startEvent: {
          action: Action.AddExpense,
          item: {
            id: "dog",
            object: { ...expense.getProps(), weeklyAmount: 900 },
          },
        },
      })
      .getExpenses()
  ).toEqual(new Map([["dog", { ...expense.getProps(), weeklyAmount: 900 }]]));
});

test("get ids returns correct ids", () => {
  expect(history.getIds()).toEqual(["tax", "superan", "bank", "salary"]);
});

test("cloning history clones values but not keys", () => {
  expect(history.clone().getEvents().keys()).toEqual(
    history.getEvents().keys()
  );

  const intersectionOfIds = history
    .clone()
    .getIds()
    .filter((id) => history.getIds().includes(id));

  expect(intersectionOfIds).toEqual([]);
});

test("networth of clone is the same as original", () => {
  const newHistory = history
    .addEvent({
      date: new Date(2020, 2),
      event: {
        action: Action.BuyHouse,
        item: {
          id: "A",
          object: houseWithPrincipalAndInterestLoan,
        },
      },
    })
    .addEvent({
      date: new Date(2020, 3),
      event: {
        action: Action.AddStock,
        item: {
          id: "B",
          object: stock,
        },
      },
    })
    .addEvent({
      date: new Date(2028, 3),
      event: {
        action: Action.SellStock,
        item: {
          id: "B",
          object: stock,
        },
      },
    });

  expect(newHistory.clone().getState(120).getNetWealth()).toEqual(
    newHistory.getState(120).getNetWealth()
  );
});

test("already owned returns correct values for added and bought stocks, houses and salaries", () => {
  const complicatedHisotry = history
    .addEvent({
      date: new Date(2020, 1),
      event: {
        action: Action.AddHouse,
        item: {
          id: "A",
          object: houseWithPrincipalAndInterestLoan,
        },
      },
    })
    .addEvent({
      date: new Date(2020, 2),
      event: {
        action: Action.BuyHouse,
        item: {
          id: "B",
          object: houseWithPrincipalAndInterestLoan,
        },
      },
    })
    .addEvent({
      date: new Date(2020, 3),
      event: {
        action: Action.AddStock,
        item: {
          id: "C",
          object: stock,
        },
      },
    })
    .addEvent({
      date: new Date(2020, 4),
      event: {
        action: Action.BuyStock,
        item: {
          id: "D",
          object: stock,
        },
      },
    })
    .addEvent({
      date: new Date(2020, 5),
      event: {
        action: Action.AddSalary,
        item: {
          id: "E",
          object: salary,
        },
      },
    });

  expect(complicatedHisotry.isAlreadyOwned({ id: "A" })).toBeTruthy();
  expect(complicatedHisotry.isAlreadyOwned({ id: "B" })).toBeFalsy();
  expect(complicatedHisotry.isAlreadyOwned({ id: "C" })).toBeTruthy();
  expect(complicatedHisotry.isAlreadyOwned({ id: "D" })).toBeFalsy();
  expect(complicatedHisotry.isAlreadyOwned({ id: "E" })).toBeTruthy();
});
