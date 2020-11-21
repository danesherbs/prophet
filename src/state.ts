import { Tax, TaxType } from "./tax";
import { Clock } from "./clock";
import { Salary } from "./salary";
import { Bank } from "./bank";
import { Stock } from "./stock";
import { House } from "./house";
import { Super } from "./super";
import { Expense } from "./expense";


class State {

    clock: Clock;
    tax: Tax;
    bank: Bank;
    superan: Super;
    salary: Salary;
    houses: Array<House>;
    stocks: Array<Stock>;
    expenses: Array<Expense>;

    constructor(
        {
            clock,
            tax,
            bank,
            superan,
            salary,
            houses,
            stocks,
            expenses
        }: {
            clock: Clock;
            tax: Tax;
            bank: Bank;
            superan: Super;
            salary: Salary;
            houses: Array<House>;
            stocks: Array<Stock>;
            expenses: Array<Expense>;
        }) {
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
        return this.bank.getBalance(this.clock.getTime()) +
            this.superan.getBalance(this.clock.getTime()) +
            this.stocks.reduce((acc, stock) => acc + stock.getNumberOfUnits() * stock.getPrice(this.clock.getTime()), 0) +
            this.houses.reduce((acc, house) => acc + house.getEquity(this.clock.getTime()), 0);
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

    receiveMonthlySalaryPayment(salary: Salary) {
        if (salary.getYearlyGrossSalary(this.clock.getTime()) < 1e-3) {
            return this;
        }

        return new State({
            clock: this.clock,
            tax: this.tax
                .declareIncome(
                    this.clock.getTime(),
                    salary.getMonthlyGrossSalary(this.clock.getTime()))
                .payTax(
                    this.clock.getTime(),
                    this.tax.getMonthlyIncomeTax(salary.getYearlyGrossSalary(this.clock.getTime())),
                    TaxType.Income)
                .payTax(this.clock.getTime(),
                    this.tax.getMonthlySuperTax(salary.getYearlyGrossSalary(this.clock.getTime())),
                    TaxType.Super
                ),
            bank: this.bank
                .deposit(
                    this.clock.getTime(),
                    salary.getMonthlyNetSalary(this.clock.getTime()),
                    "Salary"
                ),
            superan: this.superan
                .deposit(
                    this.clock.getTime(),
                    this.superan.getMonthlyNetSuperContribution(salary.getYearlyGrossSalary(this.clock.getTime()))
                ),
            salary: this.salary,
            houses: this.houses,
            stocks: this.stocks,
            expenses: this.expenses
        });
    }

    receiveMonthlyRentalIncome(house: House) {
        return new State({
            clock: this.clock,
            tax: this.tax
                .declareIncome(
                    this.clock.getTime(),
                    house.getMonthlyGrossRentalIncome(this.clock.getTime())
                ),
            bank: this.bank
                .deposit(
                    this.clock.getTime(),
                    house.getMonthlyGrossRentalIncome(this.clock.getTime()),
                    "Rental income"
                ),
            superan: this.superan,
            salary: this.salary,
            houses: this.houses,
            stocks: this.stocks,
            expenses: this.expenses
        });
    }

    payMonthlyInterestPayment(house: House) {
        return new State({
            clock: this.clock,
            tax: this.tax,
            bank: this.bank
                .withdraw(
                    this.clock.getTime(),
                    house.getMonthlyInterestPayment(),
                    "Interest payment"
                ),
            superan: this.superan,
            salary: this.salary,
            houses: this.houses,
            stocks: this.stocks,
            expenses: this.expenses
        });
    }

    declareMonthlyDepreciationLoss(house: House) {
        return new State({
            clock: this.clock,
            tax: this.tax
                .declareLoss(
                    this.clock.getTime(),
                    house.getMonthlyDepreciationAmount(this.clock.getTime()),
                ),
            bank: this.bank,
            superan: this.superan,
            salary: this.salary,
            houses: this.houses,
            stocks: this.stocks,
            expenses: this.expenses
        });
    }

    payMonthlyExpense(expense: Expense) {
        return new State({
            clock: this.clock,
            tax: this.tax,
            bank: this.bank
                .withdraw(
                    this.clock.getTime(),
                    expense.getMonthlyAmount(this.clock.getTime()),
                    expense.getDescription()
                ),
            superan: this.superan,
            salary: this.salary,
            houses: this.houses,
            stocks: this.stocks,
            expenses: this.expenses
        });
    }

    isStartOfFinancialYear() {
        return this.clock.getTime() % 12 === 0;
    }

    private registerTick() {
        if (
            this.isStartOfFinancialYear() &&
            this.tax.getNetUnpaidTaxOverLastTwelveMonths(this.clock.getTime() - 1) > 1e-3
        ) {
            return new State({
                clock: this.clock.tick(),
                tax: this.tax,
                bank: this.bank
                    .withdraw(
                        this.clock.getTime(),
                        this.tax.getNetUnpaidTaxOverLastTwelveMonths(this.clock.getTime() - 1),
                        "Tax correction",
                    ),
                superan: this.superan,
                salary: this.salary,
                houses: this.houses,
                stocks: this.stocks,
                expenses: this.expenses
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
            expenses: this.expenses
        });
    }

    buyHouse(house: House) {
        return new State({
            clock: this.clock,
            tax: this.tax,
            bank: this.bank
                .withdraw(
                    this.clock.getTime(),
                    house.getDownPayment(),
                    "Downpayment for house"
                ),
            superan: this.superan,
            salary: this.salary,
            houses: [...this.houses, house],
            stocks: this.stocks,
            expenses: this.expenses
        });
    }

    sellHouse(house: House) {
        // TODO: declare capital loss if lost money
        return new State({
            clock: this.clock,
            tax: this.tax
                .declareIncome(
                    this.clock.getTime(),
                    house.getEquity(this.clock.getTime()) - house.getDownPayment()
                ),
            bank: this.bank
                .deposit(
                    this.clock.getTime(),
                    house.getEquity(this.clock.getTime()),
                    "Sold house"
                ),
            superan: this.superan,
            salary: this.salary,
            houses: this.houses
                .splice(
                    this.houses.findIndex(
                        h => JSON.stringify(h) === JSON.stringify(house)
                    ), 1),
            stocks: this.stocks,
            expenses: this.expenses
        });
    }

    buyStock(stock: Stock) {
        return new State({
            clock: this.clock,
            tax: this.tax,
            bank: this.bank
                .withdraw(
                    this.clock.getTime(),
                    stock.getPrice(this.clock.getTime()) * stock.getNumberOfUnits(),
                    "Buy stock"
                ),
            superan: this.superan,
            salary: this.salary,
            houses: this.houses,
            stocks: [...this.stocks, stock],
            expenses: this.expenses
        });
    }

    sellStock(stock: Stock) {
        // TODO: declare capital loss if lost money
        return new State({
            clock: this.clock,
            tax: this.tax
                .declareIncome(
                    this.clock.getTime(),
                    (stock.getPrice(this.clock.getTime()) - stock.getInitialPrice()) * stock.getNumberOfUnits()
                ),
            bank: this.bank
                .deposit(
                    this.clock.getTime(),
                    stock.getPrice(this.clock.getTime()) * stock.getNumberOfUnits(),
                    "Sold stock"
                ),
            superan: this.superan,
            salary: this.salary,
            houses: this.houses,
            stocks: this.stocks
                .splice(
                    this.houses.findIndex(
                        s => JSON.stringify(s) === JSON.stringify(stock)
                    ), 1),
            expenses: this.expenses
        });
    }

    isValidLoans() {
        return this.getHouses().reduce((acc, house) => acc + house.getLoan(), 0) <= 8 * this.getSalary().getYearlyGrossSalary(this.getClock().getTime());
    }

    isValid() {
        return this.bank.isValid() && this.isValidLoans();
    }

    waitOneMonth() {
        let state: State = this;

        // Salary
        state = state.receiveMonthlySalaryPayment(this.salary);

        // Expenses
        this.expenses.forEach((expense) => {
            state = state.payMonthlyExpense(expense);
        })

        // Properties
        this.houses.forEach((house) => {
            state = state.receiveMonthlyRentalIncome(house);
            state = state.payMonthlyInterestPayment(house);
            state = state.declareMonthlyDepreciationLoss(house);
        })

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

export { State };