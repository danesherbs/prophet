import Clock from "../src/clock";
import Tax, { TaxType } from "../src/tax";
import Bank from "../src/bank";
import Salary from "../src/salary";
import House from "../src/house";
import Stock from "../src/stock";
import Super from "../src/super";
import State from "../src/state";
import Expense from "../src/expense";

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
});

const stock = new Stock({
  numberOfUnits: 10,
  pricePerUnit: 500,
  rateOfReturn: 0.1,
});

const state = new State({
  clock: clock,
  tax: new Map(),
  banks: new Map(),
  superans: new Map(),
  salaries: new Map(),
  houses: new Map(),
  stocks: new Map(),
  expenses: new Map(),
});

test("getters are working correctly", () => {
  const state = new State({
    clock: clock,
    tax: new Map([["tax a", tax]]),
    banks: new Map([["bank a", bank]]),
    superans: new Map([["super a", superan]]),
    salaries: new Map([["salary a", salary]]),
    houses: new Map([
      ["house a", house],
      ["house b", house],
    ]),
    stocks: new Map([
      ["stock a", stock],
      ["stock b", stock],
    ]),
    expenses: new Map([["expense a", expense]]),
  });

  expect(state.getClock()).toEqual(clock);
  expect(state.getSingletonTax()).toEqual(tax);
  expect(state.getSingletonBank()).toEqual(bank);
  expect(state.getSingletonSuper()).toEqual(superan);
  expect(state.getHouses()).toEqual(
    new Map([
      ["house a", house],
      ["house b", house],
    ])
  );
  expect(state.getStocks()).toEqual(
    new Map([
      ["stock a", stock],
      ["stock b", stock],
    ])
  );
  expect(state.getExpenses()).toEqual(new Map([["expense a", expense]]));
});

test("correct salary transition", () => {
  const state = new State({
    clock: clock,
    tax: new Map([["tax a", tax]]),
    banks: new Map([["bank a", bank]]),
    superans: new Map([["super a", superan]]),
    salaries: new Map([["salary a", salary]]),
    houses: new Map(),
    stocks: new Map(),
    expenses: new Map(),
  });

  expect(
    state.receiveMonthlySalaryPayment(salary).getSingletonBank().getBalance(0)
  ).toBeCloseTo(salary.getMonthlyNetSalary(0), 10);

  expect(
    state.receiveMonthlySalaryPayment(salary).getSingletonSuper().getBalance(0)
  ).toBeCloseTo(
    superan.getMonthlyNetSuperContribution(salary.getYearlyGrossSalary(0)),
    10
  );

  expect(state.receiveMonthlySalaryPayment(salary).getSingletonTax()).toEqual(
    state
      .getSingletonTax()
      .declareIncome(0, salary.getMonthlyGrossSalary(0))
      .payTax(
        0,
        tax.getMonthlyIncomeTax(salary.getYearlyGrossSalary(0)),
        TaxType.Income
      )
      .payTax(
        0,
        tax.superTaxRate *
          superan.getMonthlyGrossSuperContribution(
            salary.getYearlyGrossSalary(0)
          ),
        TaxType.Super
      )
  );
});

test("correct net wealth after a month with salary only", () => {
  const state = new State({
    clock: clock,
    tax: new Map([["tax a", tax]]),
    banks: new Map([["bank a", bank]]),
    superans: new Map([["super a", superan]]),
    salaries: new Map([["salary a", salary]]),
    houses: new Map(),
    stocks: new Map(),
    expenses: new Map(),
  });

  expect(state.getNetWealth()).toEqual(0);

  expect(state.waitOneMonth().getNetWealth()).toBeCloseTo(
    salary.getMonthlyNetSalary(0) * (1 + bank.getMonthlyInterestRate()) +
      superan.getMonthlyNetSuperContribution(120_000) *
        (1 + superan.getMonthlyInterestRate()),
    10
  );

  expect(state.waitOneMonth().waitOneMonth().getNetWealth()).toBeCloseTo(
    salary.getMonthlyNetSalary(0) *
      Math.pow(1 + bank.getMonthlyInterestRate(), 2) +
      salary.getMonthlyNetSalary(1) * (1 + bank.getMonthlyInterestRate()) +
      superan.getMonthlyNetSuperContribution(120_000) *
        (1 + superan.getMonthlyInterestRate()) +
      superan.getMonthlyNetSuperContribution(120_000) *
        Math.pow(1 + superan.getMonthlyInterestRate(), 2),
    10
  );
});

test("correct net wealth after a month with salary and expense", () => {
  const state = new State({
    clock: clock,
    tax: new Map([["tax a", tax]]),
    banks: new Map([["bank a", bank]]),
    superans: new Map([["super a", superan]]),
    salaries: new Map([["salary a", salary]]),
    houses: new Map(),
    stocks: new Map(),
    expenses: new Map([["expense a", expense]]),
  });

  expect(state.getNetWealth()).toEqual(0);

  expect(state.waitOneMonth().getNetWealth()).toBeCloseTo(
    (salary.getMonthlyNetSalary(0) - expense.getMonthlyAmount(0)) *
      (1 + bank.getMonthlyInterestRate()) +
      superan.getMonthlyNetSuperContribution(120_000) *
        (1 + superan.getMonthlyInterestRate()),
    10
  );

  expect(state.waitOneMonth().waitOneMonth().getNetWealth()).toBeCloseTo(
    (salary.getMonthlyNetSalary(1) - expense.getMonthlyAmount(1)) *
      Math.pow(1 + bank.getMonthlyInterestRate(), 2) +
      (salary.getMonthlyNetSalary(0) - expense.getMonthlyAmount(0)) *
        (1 + bank.getMonthlyInterestRate()) +
      superan.getMonthlyNetSuperContribution(120_000) *
        (1 + superan.getMonthlyInterestRate()) +
      superan.getMonthlyNetSuperContribution(120_000) *
        Math.pow(1 + superan.getMonthlyInterestRate(), 2),
    10
  );
});

test("correct net wealth after a month with salary, house, stock and expense", () => {
  const state = new State({
    clock: clock,
    tax: new Map([["tax a", tax]]),
    banks: new Map([["bank a", bank]]),
    superans: new Map([["super a", superan]]),
    salaries: new Map([["salary a", salary]]),
    houses: new Map([["house a", house]]),
    stocks: new Map([["stock a", stock]]),
    expenses: new Map([["expense a", expense]]),
  });

  expect(state.getNetWealth()).toEqual(
    house.getEquity() + stock.getTotalValue()
  );

  expect(state.waitOneMonth().getNetWealth()).toBeCloseTo(
    (salary.getMonthlyNetSalary(0) +
      house.getMonthlyGrossRentalIncome() -
      expense.getMonthlyAmount(0) -
      house.getMonthlyInterestPayment()) *
      (1 + bank.getMonthlyInterestRate()) +
      superan.getMonthlyNetSuperContribution(120_000) *
        (1 + superan.getMonthlyInterestRate()) +
      house.waitOneMonth().getEquity() +
      stock.waitOneMonth().getTotalValue(),
    10
  );
});

test("correct state change when buying stock", () => {
  const stock = new Stock({
    numberOfUnits: 10,
    pricePerUnit: 500,
    rateOfReturn: 0.1,
  });

  const state = new State({
    clock: clock,
    tax: new Map([["tax a", tax]]),
    banks: new Map([["bank a", bank]]),
    superans: new Map([["super a", superan]]),
    salaries: new Map([["salary a", salary]]),
    houses: new Map(),
    stocks: new Map([["stock a", stock]]),
    expenses: new Map(),
  });

  // Unchanged
  expect(state.buyStock({ id: "stock b", stock }).getClock()).toEqual(
    state.getClock()
  );
  expect(state.buyStock({ id: "stock b", stock }).getHouses()).toEqual(
    state.getHouses()
  );
  expect(state.buyStock({ id: "stock b", stock }).getSingletonSuper()).toEqual(
    state.getSingletonSuper()
  );
  expect(state.buyStock({ id: "stock b", stock }).getSingletonTax()).toEqual(
    state.getSingletonTax()
  );
  expect(state.buyStock({ id: "stock b", stock }).getSalaries()).toEqual(
    state.getSalaries()
  );

  // Changed
  expect(state.buyStock({ id: "stock b", stock }).getStocks()).toEqual(
    new Map([
      ["stock a", stock],
      ["stock b", stock],
    ])
  );
  expect(
    state.buyStock({ id: "stock b", stock }).getSingletonBank().getBalance(0)
  ).toEqual(state.getSingletonBank().getBalance(0) - 5_000);
});

test("correct state change when selling stock", () => {
  const state = new State({
    clock: clock,
    tax: new Map([["tax a", tax]]),
    banks: new Map([["bank a", bank]]),
    superans: new Map([["super a", superan]]),
    salaries: new Map([["salary a", salary]]),
    houses: new Map(),
    stocks: new Map([
      ["stock a", stock],
      ["stock b", stock],
    ]),
    expenses: new Map(),
  });

  const sold = state.sellStock({ id: "stock a" });

  // Unchanged
  expect(sold.getClock()).toEqual(state.getClock());
  expect(sold.getHouses()).toEqual(state.getHouses());
  expect(sold.getSingletonSuper()).toEqual(state.getSingletonSuper());
  expect(sold.getSalaries()).toEqual(state.getSalaries());

  // Changed
  expect(state.getStocks()).toEqual(
    new Map([
      ["stock a", stock],
      ["stock b", stock],
    ])
  );
  expect(sold.getStocks()).toEqual(new Map([["stock b", stock]]));
  expect(sold.getSingletonBank().getBalance(0)).toEqual(5_000);
  expect(sold.getSingletonTax()).toEqual(
    state.getSingletonTax().declareIncome(0, 0)
  );

  // Changed after one month
  expect(state.waitOneMonth().getStocks()).toEqual(
    new Map([
      ["stock a", stock.waitOneMonth()],
      ["stock b", stock.waitOneMonth()],
    ])
  );
  expect(state.waitOneMonth().sellStock({ id: "stock a" }).getStocks()).toEqual(
    new Map([["stock b", stock.waitOneMonth()]])
  );
  expect(
    state
      .waitOneMonth()
      .sellStock({ id: "stock a" })
      .getSingletonBank()
      .getBalance(1)
  ).toBeCloseTo(
    salary.getMonthlyNetSalary(0) * (1 + bank.getMonthlyInterestRate()) +
      stock.waitOneMonth().getTotalValue(),
    10
  );

  expect(
    state.waitOneMonth().sellStock({ id: "stock a" }).getSingletonTax()
  ).toEqual(
    state
      .getSingletonTax()
      .declareIncome(0, salary.getMonthlyGrossSalary(0))
      .payTax(
        0,
        tax.getMonthlyIncomeTax(salary.getYearlyGrossSalary(0)),
        TaxType.Income
      )
      .payTax(
        0,
        (salary.getYearlyGrossSalary(0) *
          superan.contributionRate *
          tax.superTaxRate) /
          12,
        TaxType.Super
      )
      .declareIncome(
        1,
        stock.waitOneMonth().getTotalValue() - stock.getTotalValue()
      )
  );
});

test("correct state change when buying a house", () => {
  const state = new State({
    clock: clock,
    tax: new Map([["tax a", tax]]),
    banks: new Map([["bank a", bank]]),
    superans: new Map([["super a", superan]]),
    salaries: new Map([["salary a", salary]]),
    houses: new Map([["house a", house]]),
    stocks: new Map(),
    expenses: new Map(),
  });

  const bought = state.buyHouse({ id: "house b", house });

  // Unchanged
  expect(bought.getClock()).toEqual(state.getClock());
  expect(bought.getStocks()).toEqual(state.getStocks());
  expect(bought.getSingletonSuper()).toEqual(state.getSingletonSuper());
  expect(bought.getSingletonTax()).toEqual(state.getSingletonTax());
  expect(bought.getSalaries()).toEqual(state.getSalaries());

  // Changed
  expect(bought.getHouses()).toEqual(
    new Map([
      ["house a", house],
      ["house b", house],
    ])
  );
  expect(bought.getSingletonBank().getBalance(0)).toEqual(
    state.getSingletonBank().getBalance(0) - 50_000
  );
});

test("correct state change when selling a house", () => {
  const state = new State({
    clock: clock,
    tax: new Map([["tax a", tax]]),
    banks: new Map([["bank a", bank]]),
    superans: new Map([["super a", superan]]),
    salaries: new Map([["salary a", salary]]),
    houses: new Map([
      ["house a", house],
      ["house b", house],
    ]),
    stocks: new Map(),
    expenses: new Map(),
  });

  const sold = state.sellHouse({ id: "house a" });

  // Unchanged
  expect(sold.getClock()).toEqual(state.getClock());
  expect(sold.getStocks()).toEqual(state.getStocks());
  expect(sold.getSingletonSuper()).toEqual(state.getSingletonSuper());
  expect(sold.getSalaries()).toEqual(state.getSalaries());

  // Changed
  expect(state.getHouses()).toEqual(
    new Map([
      ["house a", house],
      ["house b", house],
    ])
  );
  expect(sold.getHouses()).toEqual(new Map([["house b", house]]));
  expect(sold.getSingletonBank().getBalance(0)).toEqual(
    state.getSingletonBank().getBalance(0) + 50_000
  );
  expect(sold.getSingletonTax()).toEqual(
    state.getSingletonTax().declareIncome(0, 0)
  );

  // Changed after one month
  expect(state.waitOneMonth().getHouses()).toEqual(
    new Map([
      ["house a", house.waitOneMonth()],
      ["house b", house.waitOneMonth()],
    ])
  );
  expect(state.waitOneMonth().sellHouse({ id: "house a" }).getHouses()).toEqual(
    new Map([["house b", house.waitOneMonth()]])
  );
  expect(
    state
      .waitOneMonth()
      .sellHouse({ id: "house a" })
      .getSingletonBank()
      .getBalance(1)
  ).toBeCloseTo(
    state.waitOneMonth().getSingletonBank().getBalance(1) +
      house.waitOneMonth().getEquity(),
    10
  );
  expect(
    state.waitOneMonth().sellHouse({ id: "house a" }).getSingletonTax()
  ).toEqual(
    state
      .waitOneMonth()
      .getSingletonTax()
      .declareIncome(1, house.waitOneMonth().getCapitalGain())
  );
});

test("correct bank change after one month with salary and a house", () => {
  const state = new State({
    clock: clock,
    tax: new Map([["tax a", tax]]),
    banks: new Map([["bank a", bank]]),
    superans: new Map([["super a", superan]]),
    salaries: new Map([["salary a", salary]]),
    houses: new Map([["house a", house]]),
    stocks: new Map(),
    expenses: new Map(),
  });

  expect(state.getSingletonBank().getBalance(0)).toEqual(0);

  expect(
    state
      .waitOneMonth()
      .sellHouse({ id: "house a" })
      .getSingletonBank()
      .getBalance(1)
  ).toBeCloseTo(
    (state.getSingletonBank().getBalance(0) +
      salary.getMonthlyNetSalary(0) +
      house.getMonthlyGrossRentalIncome() -
      house.getMonthlyInterestPayment()) *
      (1 + bank.getMonthlyInterestRate()) +
      house.waitOneMonth().getEquity(),
    10
  );
});

test("correct state change when paying an expense", () => {
  const state = new State({
    clock: clock,
    tax: new Map([["tax a", tax]]),
    banks: new Map([["bank a", bank]]),
    superans: new Map([["super a", superan]]),
    salaries: new Map([["salary a", salary]]),
    houses: new Map(),
    stocks: new Map(),
    expenses: new Map(),
  });

  // Unchanged
  expect(state.payMonthlyExpense(expense).getClock()).toEqual(state.getClock());
  expect(state.payMonthlyExpense(expense).getStocks()).toEqual(
    state.getStocks()
  );
  expect(state.payMonthlyExpense(expense).getSingletonSuper()).toEqual(
    state.getSingletonSuper()
  );
  expect(state.payMonthlyExpense(expense).getSingletonTax()).toEqual(
    state.getSingletonTax()
  );
  expect(state.payMonthlyExpense(expense).getSalaries()).toEqual(
    state.getSalaries()
  );
  expect(state.payMonthlyExpense(expense).getHouses()).toEqual(
    state.getHouses()
  );

  // Changed
  expect(
    state.payMonthlyExpense(expense).getSingletonBank().getBalance(0)
  ).toEqual(state.getSingletonBank().getBalance(0) - (240 * 52) / 12);
});

test("correct state change after one month when owning single house", () => {
  const salary = new Salary({
    tax: tax,
    yearlyGrossSalary: 0,
    yearlySalaryIncrease: 0,
    creationTime: clock.getTime(),
  });

  const state = new State({
    clock: clock,
    tax: new Map([["tax a", tax]]),
    banks: new Map([["bank a", bank]]),
    superans: new Map([["super a", superan]]),
    salaries: new Map([["salary a", salary]]),
    houses: new Map([["house a", house]]),
    stocks: new Map(),
    expenses: new Map(),
  });

  // Unchanged
  expect(state.waitOneMonth().getStocks()).toEqual(state.getStocks());
  expect(state.waitOneMonth().getSalaries()).toEqual(state.getSalaries());
  expect(state.waitOneMonth().getHouses()).toEqual(
    state.waitOneMonth().getHouses()
  );

  // Changed
  expect(state.waitOneMonth().getSingletonSuper()).toEqual(
    state.getSingletonSuper().deposit(0, 0)
  );
  expect(state.waitOneMonth().getClock().getTime()).toEqual(1);
  expect(state.waitOneMonth().getSingletonTax()).toEqual(
    state
      .getSingletonTax()
      .declareIncome(0, 0)
      .declareIncome(0, 2_500)
      .declareLoss(0, house.getMonthlyDepreciationAmount())
      .payTax(0, 0, TaxType.Income)
      .payTax(0, 0, TaxType.Super)
  );
  expect(state.waitOneMonth().getSingletonBank().getBalance(1)).toEqual(
    state
      .getSingletonBank()
      .deposit(0, house.getMonthlyGrossRentalIncome(), "Rental income")
      .withdraw(0, house.getMonthlyInterestPayment(), "Interest payment")
      .getBalance(0) *
      (1 + bank.getMonthlyInterestRate())
  );
});

test("unpaid tax is paid at beginning of financial year", () => {
  const house = new House({
    loan: 550_000,
    houseValue: 600_000,
    yearlyInterestRate: 0.03,
    yearlyAppreciationRate: 0.03,
    monthlyGrossRentalIncome: 5_000,
    yearlyRentalIncomeIncrease: 0.03,
    buildingDepreciationRate: 0.025,
  });

  const state = new State({
    clock: clock,
    tax: new Map([["tax a", tax]]),
    banks: new Map([["bank a", bank]]),
    superans: new Map([["super a", superan]]),
    salaries: new Map([["salary a", salary]]),
    houses: new Map([["house a", house]]),
    stocks: new Map(),
    expenses: new Map(),
  });

  expect(state.waitOneYear().waitOneMonth().getClock().getTime()).toEqual(13);

  expect(
    state
      .waitOneYear()
      .waitOneMonth()
      .getSingletonBank()
      .getTransactions()
      .reduce((acc, [, , info]) => acc || info === "Tax correction", false)
  ).toBeTruthy(); // tax correction is in bank transaction history

  const [time, amount] = state
    .waitOneYear()
    .waitOneMonth()
    .getSingletonBank()
    .getTransactions()
    .find(([, , info]) => info === "Tax correction") as [
    number,
    number,
    string
  ];

  expect(time).toEqual(12); // tax paid at start of financial year

  expect(amount).toBeCloseTo(
    -state
      .waitOneYear()
      .waitOneMonth()
      .getSingletonTax()
      .getNetUnpaidTaxOverLastTwelveMonths(11),
    10
  ); // amount was unpaid tax of last financial year
});

test("buying house subtracts from bank balance", () => {
  const state = new State({
    clock: clock,
    tax: new Map([["tax a", tax]]),
    banks: new Map([["bank a", bank]]),
    superans: new Map([["super a", superan]]),
    salaries: new Map([["salary a", salary]]),
    houses: new Map(),
    stocks: new Map(),
    expenses: new Map(),
  });

  expect(
    state.buyHouse({ id: "a", house }).getSingletonBank().getBalance(0) < 0
  ).toBeTruthy();
});
