import { Tax, TaxType } from "./tax";
import { Clock } from "./clock";
import { Salary } from "./salary";
import { Bank } from "./bank";
import { Stock } from "./stock";
import { House } from "./house";
import { Super } from "./super";


let clock = new Clock();
let tax = new Tax(new Array(), new Array());
let salary = new Salary({ salary: 120000, yearSalaryIncrease: 0.05, tax, creationTime: clock.getTime() });
let superan = new Super(new Array(), 0.10);
let bank = new Bank(new Array(), 0.03);
let house = new House(tax, 50_000, 550_000, 0.03, 0.03, 2_500, 0.03, 0.02, clock.getTime());
let stock = new Stock(0.10, clock.getTime(), 400, new Array());

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

    // Property
    bank = bank
        .deposit(clock.getTime(), house.getMonthlyGrossRentalIncome(clock.getTime()), "Rental income")
        .withdraw(clock.getTime(), house.getMonthlyInterestPayment(), "Interest payment")
    tax = tax
        .declareIncome(clock.getTime(), house.getMonthlyGrossRentalIncome(clock.getTime()));

    // Stocks
    const numberOfUnits = Math.floor(bank.getBalance(clock.getTime()) / stock.getPrice(clock.getTime()));
    bank = bank
        .withdraw(clock.getTime(), numberOfUnits * stock.getPrice(clock.getTime()), "Buy stock")
    stock = stock
        .buyUnits(clock.getTime(), numberOfUnits)

    clock.tick()

    if (clock.getTime() % 12 === 0) {
        tax = tax
            .declareLoss(clock.getTime(), house.getYearlyDepreciation(clock.getTime()));
    }

    console.log('Time:', clock.getTime());
    console.log('Salary:', salary.getSalary(clock.getTime()));
    console.log('Bank transactions:', bank.getTransactions());
    console.log('Bank balance:', bank.getBalance(clock.getTime()));
    console.log('Super transactions:', superan.getTransactions());
    console.log('Super balance:', superan.getBalance(clock.getTime()));
    console.log('House value:', house.getHouseValue(clock.getTime()));
    console.log('House equity:', house.getEquity(clock.getTime()));
    console.log('Stock price:', stock.getPrice(clock.getTime()));
    console.log('Stock units:', stock.getNumberOfUnits());
    console.log('Stock value:', stock.getNumberOfUnits() * stock.getPrice(clock.getTime()));
    console.log('Tax records:', tax.getTaxRecords());
    console.log('Tax paid:', tax.getTaxPaid());

    if (clock.getTime() % 12 === 0) {
        console.log('Tax paid:', tax.getPaidIncomeTaxInCalendarYear(clock.getTime() - 1))

        const taxOwing = tax.getEndOfYearNetTax(clock.getTime() - 1, house.getYearlyDepreciation(clock.getTime()));
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