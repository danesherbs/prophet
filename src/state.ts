import * as _ from "lodash";
import Tax, { TaxType, Props as TaxProps } from "./tax";
import Clock from "./clock";
import Salary, { Props as SalaryProps } from "./salary";
import Bank, { Props as BankProps } from "./bank";
import Stock, { Props as StockProps } from "./stock";
import House, { Props as HouseProps } from "./house";
import Super, { Props as SuperProps } from "./super";
import Expense, { Props as ExpenseProps } from "./expense";

interface Collection<T> {
  [id: string]: T;
}

interface Props {
  clock: Clock;
  tax: Tax;
  bank: Bank;
  superan: Super;
  salary: Salary;
  houses: Collection<House>;
  stocks: Collection<Stock>;
  expenses: Collection<Expense>;
}

class State {
  clock: Clock;
  tax: Tax;
  bank: Bank;
  superan: Super;
  salary: Salary;
  houses: Collection<House>;
  stocks: Collection<Stock>;
  expenses: Collection<Expense>;

  constructor({
    clock,
    tax,
    bank,
    superan,
    salary,
    houses,
    stocks,
    expenses,
  }: Props) {
    this.clock = clock;
    this.tax = tax;
    this.bank = bank;
    this.superan = superan;
    this.salary = salary;
    this.houses = houses;
    this.stocks = stocks;
    this.expenses = expenses;
  }

  getNetWealth() {
    return (
      this.bank.getBalance(this.clock.getTime()) +
      this.superan.getBalance(this.clock.getTime()) +
      Object.values(this.stocks).reduce(
        (acc, stock) => acc + stock.getTotalValue(this.clock.getTime()),
        0
      ) +
      Object.values(this.houses).reduce(
        (acc, house) => acc + house.getEquity(this.clock.getTime()),
        0
      )
    );
  }

  getClock() {
    /* istanbul ignore next */
    return this.clock;
  }

  getBank() {
    /* istanbul ignore next */
    return this.bank;
  }

  getSalary() {
    /* istanbul ignore next */
    return this.salary;
  }

  getSuper() {
    /* istanbul ignore next */
    return this.superan;
  }

  getTax() {
    /* istanbul ignore next */
    return this.tax;
  }

  getStocks() {
    /* istanbul ignore next */
    return this.stocks;
  }

  getHouses() {
    /* istanbul ignore next */
    return this.houses;
  }

  getExpenses() {
    /* istanbul ignore next */
    return this.expenses;
  }

  receiveMonthlySalaryPayment(salary: Salary) {
    if (salary.getYearlyGrossSalary(this.clock.getTime()) < 1e-3) {
      return this;
    }

    return new State({
      clock: this.clock,
      tax: this.tax
        .declareIncome(
          this.clock.getTime(),
          salary.getMonthlyGrossSalary(this.clock.getTime())
        )
        .payTax(
          this.clock.getTime(),
          this.tax.getMonthlyIncomeTax(
            salary.getYearlyGrossSalary(this.clock.getTime())
          ),
          TaxType.Income
        )
        .payTax(
          this.clock.getTime(),
          this.tax.getMonthlySuperTax(
            this.superan.getMonthlyGrossSuperContribution(
              salary.getYearlyGrossSalary(this.clock.getTime())
            )
          ),
          TaxType.Super
        ),
      bank: this.bank.deposit(
        this.clock.getTime(),
        salary.getMonthlyNetSalary(this.clock.getTime()),
        "Salary"
      ),
      superan: this.superan.deposit(
        this.clock.getTime(),
        this.superan.getMonthlyNetSuperContribution(
          salary.getYearlyGrossSalary(this.clock.getTime())
        )
      ),
      salary: this.salary,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
    });
  }

  receiveMonthlyRentalIncome(house: House) {
    return new State({
      clock: this.clock,
      tax: this.tax.declareIncome(
        this.clock.getTime(),
        house.getMonthlyGrossRentalIncome(this.clock.getTime())
      ),
      bank: this.bank.deposit(
        this.clock.getTime(),
        house.getMonthlyGrossRentalIncome(this.clock.getTime()),
        "Rental income"
      ),
      superan: this.superan,
      salary: this.salary,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
    });
  }

  payMonthlyInterestPayment(house: House) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      bank: this.bank.withdraw(
        this.clock.getTime(),
        house.getMonthlyInterestPayment(),
        "Interest payment"
      ),
      superan: this.superan,
      salary: this.salary,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
    });
  }

  declareMonthlyDepreciationLoss(house: House) {
    return new State({
      clock: this.clock,
      tax: this.tax.declareLoss(
        this.clock.getTime(),
        house.getMonthlyDepreciationAmount(this.clock.getTime())
      ),
      bank: this.bank,
      superan: this.superan,
      salary: this.salary,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
    });
  }

  payMonthlyExpense(expense: Expense) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      bank: this.bank.withdraw(
        this.clock.getTime(),
        expense.getMonthlyAmount(this.clock.getTime()),
        expense.getDescription()
      ),
      superan: this.superan,
      salary: this.salary,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
    });
  }

  addExpense({ id, expense }: { id: string; expense: Expense }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      bank: this.bank,
      superan: this.superan,
      salary: this.salary,
      houses: this.houses,
      stocks: this.stocks,
      expenses: { ...this.expenses, [id]: expense },
    });
  }

  removeExpense({ id }: { id: string }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      bank: this.bank,
      superan: this.superan,
      salary: this.salary,
      houses: this.houses,
      stocks: this.stocks,
      expenses: _.omit(this.expenses, id),
    });
  }

  updateExpense({ id, data }: { id: string; data: ExpenseProps }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      bank: this.bank,
      superan: this.superan,
      salary: this.salary,
      houses: this.houses,
      stocks: this.stocks,
      expenses: {
        ...this.expenses,
        [id]: new Expense(data),
      },
    });
  }

  updateStock({ id, data }: { id: string; data: StockProps }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      bank: this.bank,
      superan: this.superan,
      salary: this.salary,
      houses: this.houses,
      stocks: { ...this.stocks, [id]: new Stock(data) },
      expenses: this.expenses,
    });
  }

  updateBank({ data }: { data: BankProps }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      bank: new Bank(data),
      superan: this.superan,
      salary: this.salary,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
    });
  }

  updateSuper({ data }: { data: SuperProps }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      bank: this.bank,
      superan: new Super(data),
      salary: this.salary,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
    });
  }

  updateSalary({ data }: { data: SalaryProps }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      bank: this.bank,
      superan: this.superan,
      salary: new Salary(data),
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
    });
  }

  updateTax({ data }: { data: TaxProps }) {
    return new State({
      clock: this.clock,
      tax: new Tax(data),
      bank: this.bank,
      superan: this.superan,
      salary: this.salary,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
    });
  }

  isStartOfFinancialYear() {
    return this.clock.getTime() % 12 === 0;
  }

  registerTick() {
    if (
      this.isStartOfFinancialYear() &&
      this.tax.getNetUnpaidTaxOverLastTwelveMonths(this.clock.getTime() - 1) >
        1e-3
    ) {
      return new State({
        clock: this.clock.tick(),
        tax: this.tax,
        bank: this.bank.withdraw(
          this.clock.getTime(),
          this.tax.getNetUnpaidTaxOverLastTwelveMonths(
            this.clock.getTime() - 1
          ),
          "Tax correction"
        ),
        superan: this.superan,
        salary: this.salary,
        houses: this.houses,
        stocks: this.stocks,
        expenses: this.expenses,
      });
    }

    // TODO: carry losses forward into next year if net tax is negative

    return new State({
      clock: this.clock.tick(),
      tax: this.tax,
      bank: this.bank,
      superan: this.superan,
      salary: this.salary,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
    });
  }

  buyHouse({ id, house }: { id: string; house: House }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      bank: this.bank.withdraw(
        this.clock.getTime(),
        house.getHouseValue(0) - house.getLoan(),
        "Downpayment for house"
      ),
      superan: this.superan,
      salary: this.salary,
      houses: { ...this.houses, [id]: house },
      stocks: this.stocks,
      expenses: this.expenses,
    });
  }

  updateHouse({ id, data }: { id: string; data: HouseProps }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      bank: this.bank,
      superan: this.superan,
      salary: this.salary,
      houses: { ...this.houses, [id]: new House(data) },
      stocks: this.stocks,
      expenses: this.expenses,
    });
  }

  sellHouse({ id }: { id: keyof Props["houses"] }) {
    // TODO: declare capital loss if lost money
    return new State({
      clock: this.clock,
      tax: this.tax.declareIncome(
        this.clock.getTime(),
        this.houses[id].getCapitalGain(this.clock.getTime())
      ),
      bank: this.bank.deposit(
        this.clock.getTime(),
        this.houses[id].getEquity(this.clock.getTime()),
        "Sold house"
      ),
      superan: this.superan,
      salary: this.salary,
      houses: _.omit(this.houses, id),
      stocks: this.stocks,
      expenses: this.expenses,
    });
  }

  buyStock({ id, stock }: { id: keyof Props["stocks"]; stock: Stock }) {
    // if stock already exists, update transaction
    return new State({
      clock: this.clock,
      tax: this.tax,
      bank: this.bank.withdraw(
        this.clock.getTime(),
        stock.getTotalValue(this.clock.getTime()),
        "Buy stock"
      ),
      superan: this.superan,
      salary: this.salary,
      houses: this.houses,
      stocks: { ...this.stocks, [id]: stock },
      expenses: this.expenses,
    });
  }

  sellStock({ id }: { id: keyof Props["stocks"] }) {
    // TODO: declare capital loss if lost money
    return new State({
      clock: this.clock,
      tax: this.tax.declareIncome(
        this.clock.getTime(),
        this.stocks[id].getTotalValue(this.clock.getTime()) -
          this.stocks[id].getTotalValue(this.stocks[id].getInitialTime())
      ),
      bank: this.bank.deposit(
        this.clock.getTime(),
        this.stocks[id].getTotalValue(this.clock.getTime()),
        "Sold stock"
      ),
      superan: this.superan,
      salary: this.salary,
      houses: this.houses,
      stocks: _.omit(this.stocks, id),
      expenses: this.expenses,
    });
  }

  isValidLoans() {
    return (
      Object.values(this.getHouses()).reduce(
        (acc, house) => acc + house.getLoan(),
        0
      ) <=
      8 * this.getSalary().getYearlyGrossSalary(this.getClock().getTime())
    );
  }

  isValid() {
    return this.bank.isValid() && this.isValidLoans();
  }

  waitOneMonth() {
    let state: State = this;

    // Salary
    state = state.receiveMonthlySalaryPayment(this.salary);

    // Expenses
    Object.values(this.expenses).forEach((expense) => {
      state = state.payMonthlyExpense(expense);
    });

    // Properties
    Object.values(this.houses).forEach((house) => {
      state = state.receiveMonthlyRentalIncome(house);
      state = state.payMonthlyInterestPayment(house);
      state = state.declareMonthlyDepreciationLoss(house);
    });

    state = state.registerTick();

    return state;
  }

  waitOneYear() {
    let state: State = this;

    for (let i = 0; i < 12; i++) {
      state = state.waitOneMonth();
    }

    return state;
  }
}

export default State;
export type { Props };
