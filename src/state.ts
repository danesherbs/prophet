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
        { clock, tax, bank, superan, salary, houses, stocks, expenses }: { clock: Clock; tax: Tax; bank: Bank; superan: Super; salary: Salary; houses: Array<House>; stocks: Array<Stock>; expenses: Array<Expense>; }) {
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

    getBank() {
        return this.bank;
    }

    getSuper() {
        return this.superan;
    }

    getTax() {
        return this.tax;
    }

    registerSalary(salary: Salary) {
        return new State({
            clock: this.clock,
            tax: this.tax
                .declareIncome(this.clock.getTime(), salary.getMonthlyGrossSalary(this.clock.getTime()))
                .payTax(this.clock.getTime(), this.tax.getMonthlyIncomeTax(salary.getYearlyGrossSalary(this.clock.getTime())), TaxType.Income)
                .payTax(this.clock.getTime(), this.tax.getMonthlySuperTax(salary.getYearlyGrossSalary(this.clock.getTime())), TaxType.Super),
            bank: this.bank
                .deposit(this.clock.getTime(), salary.getMonthlyNetSalary(this.clock.getTime()), "Salary"),
            superan: this.superan
                .deposit(this.clock.getTime(), this.superan.getMonthlyNetSuperContribution(salary.getYearlyGrossSalary(this.clock.getTime()))),
            salary: this.salary,
            houses: this.houses,
            stocks: this.stocks,
            expenses: this.expenses
        });
    }

    registerHouse(house: House) {
        return new State({
            clock: this.clock,
            tax: this.tax
                .declareIncome(this.clock.getTime(), house.getMonthlyGrossRentalIncome(this.clock.getTime())),
            bank: this.bank
                .deposit(this.clock.getTime(), house.getMonthlyGrossRentalIncome(this.clock.getTime()), "Rental income")
                .withdraw(this.clock.getTime(), house.getMonthlyInterestPayment(), "Interest payment"),
            superan: this.superan,
            salary: this.salary,
            houses: this.houses,
            stocks: this.stocks,
            expenses: this.expenses
        });
    }

    registerExpense(expense: Expense) {
        return new State({
            clock: this.clock,
            tax: this.tax,
            bank: this.bank
                .withdraw(this.clock.getTime(), expense.getMonthlyAmount(this.clock.getTime()), expense.getDescription()),
            superan: this.superan,
            salary: this.salary,
            houses: this.houses,
            stocks: this.stocks,
            expenses: this.expenses
        });
    }

    registerTick() {
        if ((this.clock.getTime() - 1) % 12 === 0) {
            return new State({
                clock: this.clock.tick(),
                tax: this.tax
                    .declareLoss(this.clock.getTime(),
                        this.houses.reduce((acc, house) => acc + house.getYearlyDepreciation(this.clock.getTime()), 0)),
                bank: this.bank,
                superan: this.superan,
                salary: this.salary,
                houses: this.houses,
                stocks: this.stocks,
                expenses: this.expenses
            });
        }

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

    waitOneMonth() {
        let state: State = this;

        // Salary
        state = state.registerSalary(this.salary);

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