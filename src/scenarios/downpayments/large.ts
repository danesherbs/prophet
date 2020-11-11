import { Tax, TaxType } from "../../tax";
import { Clock } from "../../clock";
import { Salary } from "../../salary";
import { Bank } from "../../bank";
import { House } from "../../house";
import { Super } from "../../super";


let clock = new Clock();
let tax = new Tax(clock, new Array(), new Array());
let salary = new Salary(clock, 120_000, 0.05, tax);
let superan = new Super(clock, new Array(), 0.10);
let bank = new Bank(clock, new Array(), 0.03);
let house = new House(clock, tax, 100_000, 1_100_000, 0.03, 0.03, 5_000, 0.03, 0.02);

const waitOneMonth = () => {
    // Salary
    bank = bank
        .deposit(salary.getMonthlyNetSalary(), "Salary")
    tax = tax
        .declareIncome(salary.getMonthlyGrossSalary())
        .payTax(tax.getMonthlyIncomeTax(salary.getMonthlyGrossSalary()), TaxType.Income)

    // Super
    superan = superan
        .deposit(superan.getMonthlySuperContribution(salary.getMonthlyGrossSalary()))
    tax = tax
        .payTax(tax.getMonthlySuperTax(salary.getMonthlyGrossSalary()), TaxType.Super)

    // Expenses
    bank = bank
        .withdraw(350, "Living expenses")

    // Property
    bank = bank
        .deposit(house.getMonthlyGrossRentalIncome(), "Rental income")
        .withdraw(house.getMonthlyInterestPayment(), "Interest payment")
    tax = tax
        .declareIncome(house.getMonthlyGrossRentalIncome());

    clock.tick()

    if (clock.getTime() % 12 === 0) {
        tax = tax
            .declareLoss(house.getYearlyDepreciation());
    }

    console.log('Time:', clock.getTime());
    console.log('Salary:', salary.getSalary());
    console.log('Bank balance:', bank.getBalance());
    console.log('Super balance:', superan.getBalance());
    console.log('House value:', house.getHouseValue());
    console.log('House equity:', house.getEquity());
    console.log('Rental income:', house.getMonthlyNetRentalIncome() - house.getMonthlyInterestPayment());

    if (clock.getTime() % 12 === 0) {
        const taxOwing = tax.getEndOfYearNetTax(clock.getTime() - 1, house.getYearlyDepreciation());
        console.log('Tax owing:', taxOwing);

        if (taxOwing < 0) {
            console.log('Refund:', -taxOwing);
            bank = bank.deposit(-taxOwing, "Tax refund");
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