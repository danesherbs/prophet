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
        clock: Clock,
        tax: Tax,
        bank: Bank,
        superan: Super,
        salaries: Array<Salary>,
        houses: Array<House>,
        stocks: Array<Stock>,
        expenses: Array<Expense>) {
        this.clock = clock;
        this.tax = tax;
        this.bank = bank;
        this.superan = superan;
        this.salaries = salaries;
        this.houses = houses;
        this.stocks = stocks;
        this.expenses = expenses;
    }

    registerSalary(salary: Salary) {
        return new State(
            this.clock,
            this.tax
                .declareIncome(this.clock.getTime(), salary.getMonthlyGrossSalary())
                .payTax(this.clock.getTime(), this.tax.getMonthlyIncomeTax(salary.getMonthlyGrossSalary()), TaxType.Income)
                .payTax(this.clock.getTime(), this.tax.getMonthlySuperTax(salary.getMonthlyGrossSalary()), TaxType.Super),
            this.bank
                .deposit(salary.getMonthlyNetSalary(), "Salary"),
            this.superan
                .deposit(this.superan.getMonthlySuperContribution(salary.getMonthlyGrossSalary())),
            this.salaries,
            this.houses,
            this.stocks,
            this.expenses,
        )
    }

    registerHouse(house: House) {
        return new State(
            this.clock,
            this.tax
                .declareIncome(this.clock.getTime(), house.getMonthlyGrossRentalIncome(this.clock.getTime())),
            this.bank
                .deposit(house.getMonthlyGrossRentalIncome(this.clock.getTime()), "Rental income")
                .withdraw(house.getMonthlyInterestPayment(), "Interest payment"),
            this.superan,
            this.salaries,
            this.houses,
            this.stocks,
            this.expenses,
        );
    }

    registerExpense(expense: Expense) {
        return new State(
            this.clock,
            this.tax,
            this.bank
                .withdraw(expense.getMonthlyAmount(), expense.getDescription()),
            this.superan,
            this.salaries,
            this.houses,
            this.stocks,
            this.expenses,
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

        this.clock.tick()

        // if (clock.getTime() % 12 === 0) {
        //     state = new State(
        //         this.clock,
        //         this.tax
        //             .declareLoss(house.getYearlyDepreciation()),
        //         this.bank,
        //         this.superan,
        //         this.salaries,
        //         this.houses,
        //         this.stocks,
        //         this.expenses,
        //     );
        // }

        return state;
    }

}

export { State };