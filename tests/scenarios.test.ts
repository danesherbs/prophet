import Clock from "../src/clock";
import Tax from "../src/tax";
import Bank from "../src/bank";
import Salary from "../src/salary";
import House from "../src/house";
import Stock from "../src/stock";
import Super from "../src/super";
import Expense from "../src/expense";
import History, { Action, Event } from "../src/history";
import Loan from "../src/loan";
import Scenarios from "../src/scenarios";

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
  tax: tax,
  transactions: [],
  yearlyInterestRate: 0.1,
  contributionRate: 0.125,
});

const salary = new Salary({
  tax: tax,
  yearlyGrossSalary: 340_000,
  yearlySalaryIncrease: 0.1,
});

const loan = new Loan({
  amountBorrowed: 550_000,
  yearlyInterestRate: 0.03,
  monthlyFee: 30,
  isInterestOnly: false,
  lengthOfLoanInMonths: 12 * 30,
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

const histories = {
  a: history.getProps(),
  b: history.getProps(),
  c: history.getProps(),
};

const scenarios = new Scenarios({ histories });

test("able to parse serialised string as JSON", () => {
  expect(JSON.parse(scenarios.toString())).toEqual(
    scenarios.getProps().histories
  );
});

test("able to load serialised string", () => {
  expect(
    JSON.stringify(Scenarios.fromJSON(JSON.parse(scenarios.toString())))
  ).toEqual(JSON.stringify(scenarios));
});

test("able to call methods on de-serialised string", () => {
  const deserialised = Scenarios.fromJSON(JSON.parse(scenarios.toString()));

  expect(deserialised?.getProps()).toEqual(scenarios.getProps());
  expect(deserialised?.getIds()).toEqual(scenarios.getIds());
  expect(JSON.stringify(deserialised?.getHistory({ id: "a" }))).toEqual(
    JSON.stringify(scenarios.getHistory({ id: "a" }))
  );
});

test("deleting scenario removes id from id list", () => {
  expect(scenarios.removeHistory({ id: "a" }).getIds()).toEqual(["b", "c"]);
});
