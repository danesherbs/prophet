import { Tax, TaxType } from "../../tax";
import { Clock } from "../../clock";
import { Salary } from "../../salary";
import { Bank } from "../../bank";
import { House } from "../../house";
import { Super } from "../../super";


let clock = new Clock(0);
let tax = new Tax({ declared: new Array(), paid: new Array() });
let salary = new Salary({ salary: 120000, yearSalaryIncrease: 0.05, tax, creationTime: clock.getTime() });
let superan = new Super({ transactions: new Array(), interestRate: 0.1 });
let bank = new Bank({ transactions: new Array(), interestRate: 0.03 });
let houseOne = new House({ tax, downPayment: 50000, loan: 550000, interestRate: 0.03, appreciation: 0.03, monthlyRentalIncome: 2500, yearlyRentalIncomeIncrease: 0.03, buildingDepreciation: 0.02, purchaseTime: 0 });
let houseTwo = new House({ tax, downPayment: 50000, loan: 550000, interestRate: 0.03, appreciation: 0.03, monthlyRentalIncome: 2500, yearlyRentalIncomeIncrease: 0.03, buildingDepreciation: 0.02, purchaseTime: 0 });

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

    // Property one
    bank = bank
        .deposit(clock.getTime(), houseOne.getMonthlyGrossRentalIncome(clock.getTime()), "Rental income")
        .withdraw(clock.getTime(), houseOne.getMonthlyInterestPayment(), "Interest payment")
    tax = tax
        .declareIncome(clock.getTime(), houseOne.getMonthlyGrossRentalIncome(clock.getTime()));

    // Property two
    bank = bank
        .deposit(clock.getTime(), houseTwo.getMonthlyGrossRentalIncome(clock.getTime()), "Rental income")
        .withdraw(clock.getTime(), houseTwo.getMonthlyInterestPayment(), "Interest payment")
    tax = tax
        .declareIncome(clock.getTime(), houseTwo.getMonthlyGrossRentalIncome(clock.getTime()));

    clock.tick()

    if (clock.getTime() % 12 === 0) {
        tax = tax
            .declareLoss(clock.getTime(), houseOne.getYearlyDepreciation(clock.getTime()));
    }

    if (clock.getTime() % 12 === 0) {
        tax = tax
            .declareLoss(clock.getTime(), houseTwo.getYearlyDepreciation(clock.getTime()));
    }

    console.log('Time:', clock.getTime());
    console.log('Salary:', salary.getSalary(clock.getTime()));
    console.log('Bank balance:', bank.getBalance(clock.getTime()));
    console.log('Super balance:', superan.getBalance(clock.getTime()));
    console.log('House one value:', houseOne.getHouseValue(clock.getTime()));
    console.log('House one equity:', houseOne.getEquity(clock.getTime()));
    console.log('House two value:', houseTwo.getHouseValue(clock.getTime()));
    console.log('House two equity:', houseTwo.getEquity(clock.getTime()));

    if (clock.getTime() % 12 === 0) {
        const taxOwing = tax.getEndOfYearNetTax(clock.getTime() - 1, houseOne.getYearlyDepreciation(clock.getTime()) + houseTwo.getYearlyDepreciation(clock.getTime()));
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