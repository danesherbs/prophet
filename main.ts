import { Tax } from "./tax";
import { Clock } from "./clock";
import { Salary } from "./salary";
import { Bank } from "./bank";
import { Stock } from "./stock";
import { House } from "./house";


let clock = new Clock();
let tax = new Tax(clock, new Array(), new Array());
let salary = new Salary(clock, 120_000, 0.05, tax);
let bank = new Bank(clock, new Array(), 0.03);
let house = new House(clock, tax, 50_000, 550_000, 0.03, 0.03, 2_500, 0.03, 0.00);
let stock = new Stock(clock, clock.getTime(), 0.11, 400, 1);

const waitOneMonth = () => {
    // Salary
    bank = bank.deposit(salary.getMonthlyNetSalary())
    tax = tax
        .declareIncome(salary.getMonthlyGrossSalary())
        .payTax(tax.getIncomeTax(salary.getMonthlyGrossSalary()))

    // Property
    bank = bank
        .deposit(house.getMonthlyGrossRentalIncome())
        .withdraw(house.getMonthlyInterestPayment())
    tax = tax.declareIncome(house.getMonthlyGrossRentalIncome());

    // Stocks
    const numberOfUnits = Math.floor(bank.getBalance() / stock.getPrice());
    bank = bank.withdraw(numberOfUnits * stock.getPrice())
    stock = stock.buyUnits(numberOfUnits)

    clock.tick()

    console.log('Time:', clock.getTime());
    console.log('Bank transactions:', bank.getTransactions());
    console.log('Bank balance:', bank.getBalance());
    console.log('House value:', house.getHouseValue());
    console.log('Stock price:', stock.getPrice());
    console.log('Stock units:', stock.getNumberOfUnits());
    console.log('Stock value:', stock.getNumberOfUnits() * stock.getPrice());
    console.log('Tax records:', tax.getTaxRecords());

    if (clock.getTime() % 12 === 0) {
        console.log('Tax paid:', tax.getPaidIncomeTaxInCalendarYear(clock.getTime() - 1))
        console.log('Tax owing:', tax.getEndOfYearNetTax(clock.getTime() - 1, house.getYearlyDepreciation()));
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