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
let houseOne = new House(clock, tax, 50_000, 550_000, 0.03, 0.03, 2_500, 0.03, 0.02);
let houseTwo = new House(clock, tax, 50_000, 550_000, 0.03, 0.03, 2_500, 0.03, 0.02);

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

    // Property one
    bank = bank
        .deposit(houseOne.getMonthlyGrossRentalIncome(), "Rental income")
        .withdraw(houseOne.getMonthlyInterestPayment(), "Interest payment")
    tax = tax
        .declareIncome(houseOne.getMonthlyGrossRentalIncome());

    // Property two
    bank = bank
        .deposit(houseTwo.getMonthlyGrossRentalIncome(), "Rental income")
        .withdraw(houseTwo.getMonthlyInterestPayment(), "Interest payment")
    tax = tax
        .declareIncome(houseTwo.getMonthlyGrossRentalIncome());

    clock.tick()

    if (clock.getTime() % 12 === 0) {
        tax = tax
            .declareLoss(houseOne.getYearlyDepreciation());
    }

    if (clock.getTime() % 12 === 0) {
        tax = tax
            .declareLoss(houseTwo.getYearlyDepreciation());
    }

    console.log('Time:', clock.getTime());
    console.log('Salary:', salary.getSalary());
    console.log('Bank balance:', bank.getBalance());
    console.log('Super balance:', superan.getBalance());
    console.log('House one value:', houseOne.getHouseValue());
    console.log('House one equity:', houseOne.getEquity());
    console.log('House two value:', houseTwo.getHouseValue());
    console.log('House two equity:', houseTwo.getEquity());

    if (clock.getTime() % 12 === 0) {
        const taxOwing = tax.getEndOfYearNetTax(clock.getTime() - 1, houseOne.getYearlyDepreciation() + houseTwo.getYearlyDepreciation());
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