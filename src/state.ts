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
    salaries: Array<Salary>;
    houses: Array<House>;
    stocks: Array<Stock>;
    expenses: Array<Expense>;

    constructor(
        { clock, tax, bank, superan, salaries, houses, stocks, expenses }: { clock: Clock; tax: Tax; bank: Bank; superan: Super; salaries: Array<Salary>; houses: Array<House>; stocks: Array<Stock>; expenses: Array<Expense>; }) {
        this.clock = clock;
        this.tax = tax;
        this.bank = bank;
        this.superan = superan;
        this.salaries = salaries;
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

    registerSalary(salary: Salary) {
        return new State(
            {
                clock: this.clock,
                tax: this.tax
                    .declareIncome(this.clock.getTime(), salary.getMonthlyGrossSalary(this.clock.getTime()))
                    .payTax(this.clock.getTime(), this.tax.getMonthlyIncomeTax(salary.getMonthlyGrossSalary(this.clock.getTime())), TaxType.Income)
                    .payTax(this.clock.getTime(), this.tax.getMonthlySuperTax(salary.getMonthlyGrossSalary(this.clock.getTime())), TaxType.Super),
                bank: this.bank
                    .deposit(this.clock.getTime(), salary.getMonthlyNetSalary(this.clock.getTime()), "Salary"),
                superan: this.superan
                    .deposit(this.clock.getTime(), this.superan.getMonthlySuperContribution(salary.getMonthlyGrossSalary(this.clock.getTime()))),
                salaries: this.salaries,
                houses: this.houses,
                stocks: this.stocks,
                expenses: this.expenses
            },
        )
    }

    registerHouse(house: House) {
        return new State(
            {
                clock: this.clock,
                tax: this.tax
                    .declareIncome(this.clock.getTime(), house.getMonthlyGrossRentalIncome(this.clock.getTime())),
                bank: this.bank
                    .deposit(this.clock.getTime(), house.getMonthlyGrossRentalIncome(this.clock.getTime()), "Rental income")
                    .withdraw(this.clock.getTime(), house.getMonthlyInterestPayment(), "Interest payment"),
                superan: this.superan,
                salaries: this.salaries,
                houses: this.houses,
                stocks: this.stocks,
                expenses: this.expenses
            },
        );
    }

    registerExpense(expense: Expense) {
        return new State(
            {
                clock: this.clock,
                tax: this.tax,
                bank: this.bank
                    .withdraw(this.clock.getTime(), expense.getMonthlyAmount(this.clock.getTime()), expense.getDescription()),
                superan: this.superan,
                salaries: this.salaries,
                houses: this.houses,
                stocks: this.stocks,
                expenses: this.expenses
            },
        );
    }

    registerTick() {
        if ((this.clock.getTime() - 1) % 12 === 0) {
            return new State(
                {
                    clock: this.clock.tick(),
                    tax: this.tax
                        .declareLoss(this.clock.getTime(),
                            this.houses.reduce((acc, house) => acc + house.getYearlyDepreciation(this.clock.getTime()), 0)),
                    bank: this.bank,
                    superan: this.superan,
                    salaries: this.salaries,
                    houses: this.houses,
                    stocks: this.stocks,
                    expenses: this.expenses
                }
            );
        }

        return new State(
            {
                clock: this.clock.tick(),
                tax: this.tax,
                bank: this.bank,
                superan: this.superan,
                salaries: this.salaries,
                houses: this.houses,
                stocks: this.stocks,
                expenses: this.expenses
            },
        );
    }

    next() {
        let state: State = this;

        // Salaries
        this.salaries.forEach((salary) => {
            state = state.registerSalary(salary);
        })

        // Expenses
        this.expenses.forEach((expense) => {
            state = state.registerExpense(expense);
        })

        // Properties
        this.houses.forEach((house) => {
            state = state.registerHouse(house);
        })

        state = state.registerTick();

        return state;
    }

}

export { State };