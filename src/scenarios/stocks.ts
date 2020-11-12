import { Tax, TaxType } from "../tax";
import { Clock } from "../clock";
import { Salary } from "../salary";
import { Bank } from "../bank";
import { Stock } from "../stock";
import { Super } from "../super";


let clock = new Clock();
let tax = new Tax(new Array(), new Array());
let salary = new Salary({ salary: 120000, yearSalaryIncrease: 0.05, tax, creationTime: clock.getTime() });
let superan = new Super(new Array(), 0.10);
let bank = new Bank(new Array(), 0.03);
let stock = new Stock(0.10, clock.getTime(), 500, new Array([0, 100]));

const waitOneMonth = () => {
    // Salary
    bank = bank
        .deposit(clock.getTime(), salary.getMonthlyNetSalary(clock.getTime()), "Salary")
    tax = tax
        .declareIncome(clock.getTime(), salary.getMonthlyGrossSalary(clock.getTime()))
        .payTax(clock.getTime(), tax.getMonthlyIncomeTax(salary.getMonthlyGrossSalary(clock.getTime())), TaxType.Income)

    // Super
    superan = superan
        .deposit(clock.getTime(), superan.getMonthlySuperContribution(salary.getMonthlyGrossSalary(clock.getTime())))
    tax = tax
        .payTax(clock.getTime(), tax.getMonthlySuperTax(salary.getMonthlyGrossSalary(clock.getTime())), TaxType.Super)

    // Expenses
    bank = bank
        .withdraw(clock.getTime(), 350, "Living expenses")

    clock.tick()

    console.log('Time:', clock.getTime());
    console.log('Salary:', salary.getSalary(clock.getTime()));
    console.log('Bank balance:', bank.getBalance(clock.getTime()));
    console.log('Super balance:', superan.getBalance(clock.getTime()));
    console.log('Stock price:', stock.getPrice(clock.getTime()));
    console.log('Stock units:', stock.getNumberOfUnits());
    console.log('Stock value:', stock.getNumberOfUnits() * stock.getPrice(clock.getTime()));

    if (clock.getTime() % 12 === 0) {
        const taxOwing = tax.getEndOfYearNetTax(clock.getTime() - 1, 0.0);
        console.log('Tax owing:', taxOwing);

        if (taxOwing < 0) {
            console.log('Refund:', -taxOwing);
            bank = bank.deposit(clock.getTime(), -taxOwing, "Tax refund");
        }
    }
}

const waitOneYear = () => {
    for (let i = 0; i < 12; i++) {
        waitOneMonth();
    }
}

const waitOneDecade = () => {
    for (let i = 0; i < 10; i++) {
        waitOneYear();
    }
}

// waitOneMonth();
// waitOneYear();
waitOneDecade();