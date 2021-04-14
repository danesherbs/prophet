import * as _ from "lodash";
import Tax, { TaxType } from "./tax";
import Clock from "./clock";
import Salary from "./salary";
import Bank from "./bank";
import Stock from "./stock";
import House from "./house";
import Super from "./super";
import Expense from "./expense";
import Loan from "./loan";

interface Props {
  clock: Clock;
  tax: Map<string, Tax>;
  banks: Map<string, Bank>;
  superans: Map<string, Super>;
  salaries: Map<string, Salary>;
  houses: Map<string, House>;
  stocks: Map<string, Stock>;
  expenses: Map<string, Expense>;
  loans: Map<string, Loan>;
}

class State {
  clock: Clock;
  tax: Map<string, Tax>;
  banks: Map<string, Bank>;
  superans: Map<string, Super>;
  salaries: Map<string, Salary>;
  houses: Map<string, House>;
  stocks: Map<string, Stock>;
  expenses: Map<string, Expense>;
  loans: Map<string, Loan>;

  constructor({
    clock,
    tax,
    banks,
    superans,
    salaries,
    houses,
    stocks,
    expenses,
    loans,
  }: Props) {
    this.clock = clock;
    this.tax = tax;
    this.banks = banks;
    this.superans = superans;
    this.salaries = salaries;
    this.houses = houses;
    this.stocks = stocks;
    this.expenses = expenses;
    this.loans = loans;
  }

  getNetWealth() {
    return (
      Array.from(this.banks.values()).reduce(
        (acc, bank) => acc + bank.getBalance(this.clock.getTime()),
        0
      ) +
      Array.from(this.superans.values()).reduce(
        (acc, superan) => superan.getBalance(this.clock.getTime()),
        0
      ) +
      Array.from(this.stocks.values()).reduce(
        (acc, stock) => acc + stock.getTotalValue(),
        0
      ) +
      Array.from(this.houses.values()).reduce(
        (acc, house) => acc + house.getEquity(),
        0
      )
    );
  }

  getClock() {
    /* istanbul ignore next */
    return this.clock;
  }

  getBanks() {
    /* istanbul ignore next */
    return this.banks;
  }

  getSalaries() {
    /* istanbul ignore next */
    return this.salaries;
  }

  getSupers() {
    /* istanbul ignore next */
    return this.superans;
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

  getLoans() {
    /* istanbul ignore next */
    return this.loans;
  }

  getSingletonTax() {
    if (this.tax.size > 1) {
      throw new Error(`Expected at most 1 tax but got ${this.tax.size}`);
    }

    const [tax] = [...this.tax.values()];
    return tax;
  }

  getSingletonSuper() {
    if (this.superans.size > 1) {
      throw new Error(`Expected at most 1 super but got ${this.superans.size}`);
    }

    const [superan] = [...this.superans.values()];
    return superan;
  }

  getSingletonBank() {
    if (this.banks.size > 1) {
      throw new Error(`Expected at most 1 bank but got ${this.banks.size}`);
    }

    const [bank] = [...this.banks.values()];
    return bank;
  }

  receiveMonthlySalaryPayment(salary: Salary) {
    return new State({
      clock: this.clock,
      tax: new Map(
        [...this.tax].map(([id, tax]) => [
          id,
          tax
            .declareIncome(this.clock.getTime(), salary.getMonthlyGrossSalary())
            .payTax(
              this.clock.getTime(),
              this.getSingletonTax().getMonthlyIncomeTax(
                salary.getYearlyGrossSalary()
              ),
              TaxType.Income
            )
            .payTax(
              this.clock.getTime(),
              this.getSingletonTax().getMonthlySuperTax(
                this.getSingletonSuper().getMonthlyGrossSuperContribution(
                  salary.getYearlyGrossSalary()
                )
              ),
              TaxType.Super
            ),
        ])
      ),
      banks: new Map(
        [...this.getBanks()].map(([id, bank]) => [
          id,
          bank.deposit(
            this.clock.getTime(),
            salary.getMonthlyNetSalary(),
            "Salary"
          ),
        ])
      ),
      superans: new Map(
        [...this.getSupers()].map(([id, superan]) => [
          id,
          superan.deposit(
            this.clock.getTime(),
            superan.getMonthlyNetSuperContribution(
              salary.getYearlyGrossSalary()
            )
          ),
        ])
      ),
      salaries: this.salaries,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  receiveMonthlyRentalIncome(house: House) {
    return new State({
      clock: this.clock,
      tax: new Map(
        [...this.tax].map(([id, tax]) => [
          id,
          tax.declareIncome(
            this.clock.getTime(),
            house.getMonthlyGrossRentalIncome()
          ),
        ])
      ),
      banks: new Map(
        [...this.getBanks()].map(([id, bank]) => [
          id,
          bank.deposit(
            this.clock.getTime(),
            house.getMonthlyGrossRentalIncome(),
            "Rental income"
          ),
        ])
      ),
      superans: this.superans,
      salaries: this.salaries,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  payMonthlyInterestPayment(house: House) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      banks: new Map(
        [...this.getBanks()].map(([id, bank]) => [
          id,
          bank.withdraw(
            this.clock.getTime(),
            house.getMonthlyInterestPayment(),
            "Interest payment"
          ),
        ])
      ),
      superans: this.superans,
      salaries: this.salaries,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  declareMonthlyDepreciationLoss(house: House) {
    return new State({
      clock: this.clock,
      tax: new Map(
        [...this.tax].map(([id, tax]) => [
          id,
          tax.declareLoss(
            this.clock.getTime(),
            house.getMonthlyDepreciationAmount()
          ),
        ])
      ),
      banks: this.banks,
      superans: this.superans,
      salaries: this.salaries,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  payMonthlyExpense(expense: Expense) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      banks: new Map(
        [...this.getBanks()].map(([id, bank]) => [
          id,
          bank.withdraw(
            this.clock.getTime(),
            expense.getMonthlyAmount(this.clock.getTime()),
            "Pay expense"
          ),
        ])
      ),
      superans: this.superans,
      salaries: this.salaries,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  payMonthlyLoanRepayment(loan: Loan) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      banks: new Map(
        [...this.getBanks()].map(([id, bank]) => [
          id,
          bank.withdraw(
            this.clock.getTime(),
            loan.getMonthlyPayment(),
            "Loan payment"
          ),
        ])
      ),
      superans: this.superans,
      salaries: this.salaries,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  addTax({ id, tax }: { id: string; tax: Tax }) {
    return new State({
      clock: this.clock,
      tax: new Map([...this.tax, [id, tax]]),
      banks: this.banks,
      superans: this.superans,
      salaries: this.salaries,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  addBank({ id, bank }: { id: string; bank: Bank }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      banks: new Map([...this.banks, [id, bank]]),
      superans: this.superans,
      salaries: this.salaries,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  addSuper({ id, superan }: { id: string; superan: Super }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      banks: this.banks,
      superans: new Map([...this.superans, [id, superan]]),
      salaries: this.salaries,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  addSalary({ id, salary }: { id: string; salary: Salary }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      banks: this.banks,
      superans: this.superans,
      salaries: new Map([...this.salaries, [id, salary]]),
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  removeSalary({ id }: { id: string }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      banks: this.banks,
      superans: this.superans,
      salaries: new Map([...this.salaries].filter(([i]) => i !== id)),
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  addExpense({ id, expense }: { id: string; expense: Expense }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      banks: this.banks,
      superans: this.superans,
      salaries: this.salaries,
      houses: this.houses,
      stocks: this.stocks,
      expenses: new Map([...this.expenses, [id, expense]]),
      loans: this.loans,
    });
  }

  removeExpense({ id }: { id: string }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      banks: this.banks,
      superans: this.superans,
      salaries: this.salaries,
      houses: this.houses,
      stocks: this.stocks,
      expenses: new Map([...this.expenses].filter(([i]) => i !== id)),
      loans: this.loans,
    });
  }

  buyHouse({ id, house }: { id: string; house: House }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      banks: new Map(
        [...this.getBanks()].map(([id, bank]) => [
          id,
          bank.withdraw(
            this.clock.getTime(),
            house.getEquity(),
            "Downpayment for house"
          ),
        ])
      ),
      superans: this.superans,
      salaries: this.salaries,
      houses: new Map([...this.houses, [id, house]]),
      stocks: this.stocks,
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  addHouse({ id, house }: { id: string; house: House }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      banks: this.banks,
      superans: this.superans,
      salaries: this.salaries,
      houses: new Map([...this.houses, [id, house]]),
      stocks: this.stocks,
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  sellHouse({ id }: { id: string }) {
    const house = this.houses.get(id);

    if (house === undefined) {
      throw new Error(`Tried to sell non-existent house with id ${id}`);
    }

    // TODO: declare capital loss if lost money
    return new State({
      clock: this.clock,
      tax: new Map(
        [...this.tax].map(([id, tax]) => [
          id,
          tax.declareIncome(this.clock.getTime(), house.getCapitalGain()),
        ])
      ),
      banks: new Map(
        [...this.getBanks()].map(([id, bank]) => [
          id,
          bank.deposit(this.clock.getTime(), house.getEquity(), "Sold house"),
        ])
      ),
      superans: this.superans,
      salaries: this.salaries,
      houses: new Map([...this.houses].filter(([i]) => i !== id)),
      stocks: this.stocks,
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  addStock({ id, stock }: { id: string; stock: Stock }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      banks: this.banks,
      superans: this.superans,
      salaries: this.salaries,
      houses: this.houses,
      stocks: new Map([...this.stocks, [id, stock]]),
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  buyStock({ id, stock }: { id: string; stock: Stock }) {
    // if stock already exists, update transaction
    return new State({
      clock: this.clock,
      tax: this.tax,
      banks: new Map(
        [...this.getBanks()].map(([id, bank]) => [
          id,
          bank.withdraw(
            this.clock.getTime(),
            stock.getTotalValue(),
            "Buy stock"
          ),
        ])
      ),
      superans: this.superans,
      salaries: this.salaries,
      houses: this.houses,
      stocks: new Map([...this.stocks, [id, stock]]),
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  sellStock({ id }: { id: string }) {
    // TODO: declare capital loss if lost money

    const stock = this.stocks.get(id);

    if (stock === undefined) {
      throw new Error(`Stock with id ${id} doesn't exist`);
    }

    return new State({
      clock: this.clock,
      tax: new Map(
        [...this.tax].map(([id, tax]) => [
          id,
          tax.declareIncome(
            this.clock.getTime(),
            stock.getTotalValue() - stock.getInitialValue()
          ),
        ])
      ),
      banks: new Map(
        [...this.getBanks()].map(([id, bank]) => [
          id,
          bank.deposit(
            this.clock.getTime(),
            stock.getTotalValue(),
            "Sold stock"
          ),
        ])
      ),
      superans: this.superans,
      salaries: this.salaries,
      houses: this.houses,
      stocks: new Map([...this.stocks].filter(([i]) => i !== id)),
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  addLoan({ id, loan }: { id: string; loan: Loan }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      banks: this.banks,
      superans: this.superans,
      salaries: this.salaries,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
      loans: new Map([...this.loans, [id, loan]]),
    });
  }

  removeLoan({ id }: { id: string }) {
    return new State({
      clock: this.clock,
      tax: this.tax,
      banks: this.banks,
      superans: this.superans,
      salaries: this.salaries,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
      loans: new Map([...this.loans].filter(([i]) => i !== id)),
    });
  }

  isStartOfFinancialYear() {
    return this.clock.getTime() % 12 === 0;
  }

  registerTick() {
    if (
      this.isStartOfFinancialYear() &&
      this.getSingletonTax().getNetUnpaidTaxOverLastTwelveMonths(
        this.clock.getTime() - 1
      ) > 1e-3
    ) {
      return new State({
        clock: this.clock.tick(),
        tax: this.tax,
        banks: new Map(
          [...this.getBanks()].map(([id, bank]) => [
            id,
            bank.withdraw(
              this.clock.getTime(),
              this.getSingletonTax().getNetUnpaidTaxOverLastTwelveMonths(
                this.clock.getTime() - 1
              ),
              "Tax correction"
            ),
          ])
        ),
        superans: this.superans,
        salaries: this.salaries,
        houses: this.houses,
        stocks: this.stocks,
        expenses: this.expenses,
        loans: this.loans,
      });
    }

    // TODO: carry losses forward into next year if net tax is negative

    return new State({
      clock: this.clock.tick(),
      tax: this.tax,
      banks: this.banks,
      superans: this.superans,
      salaries: this.salaries,
      houses: this.houses,
      stocks: this.stocks,
      expenses: this.expenses,
      loans: this.loans,
    });
  }

  isValidLoans() {
    /* istanbul ignore next */

    throw new Error(
      "Not implemented! Returns true iff loaning less than 8x gross salary."
    );
  }

  isValid() {
    /* istanbul ignore next */

    throw new Error(
      "Not implemented! true iff all child classes are valid and not loaning too much."
    );
  }

  waitOneMonth() {
    let state: State = this;

    // Salary
    this.salaries.forEach((salary, id) => {
      state = state.receiveMonthlySalaryPayment(salary);
      state = state.addSalary({ id, salary: salary.waitOneMonth() });
    });

    // Expenses
    this.expenses.forEach((expense) => {
      state = state.payMonthlyExpense(expense);
    });

    // Properties
    this.houses.forEach((house, id) => {
      state = state.receiveMonthlyRentalIncome(house);
      state = state.payMonthlyInterestPayment(house);
      state = state.declareMonthlyDepreciationLoss(house);
      state = state.addHouse({ id, house: house.waitOneMonth() });
    });

    // Stocks
    this.stocks.forEach((stock, id) => {
      state = state.addStock({ id, stock: stock.waitOneMonth() });
    });

    // Loans
    this.loans.forEach((loan, id) => {
      state = state.payMonthlyLoanRepayment(loan);
      state = state.addLoan({ id, loan: loan.waitOneMonth() });
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
