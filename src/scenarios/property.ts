import { Clock } from "../clock";
import { Tax } from "../tax";
import { Bank } from "../bank";
import { Salary } from "../salary";
import { House } from "../house";
import { Stock } from "../stock";
import { Super } from "../super";
import { State } from "../state";
import { Expense } from "../expense";


const clock = new Clock(0);

const tax = new Tax({
    incomeTaxBrackets: new Array(
        [[0.0, 18_200], 0.0],
        [[18_201, 37_000], 0.19],
        [[37_001, 87_000], 0.325],
        [[87_001, 180_000], 0.37],
        [[180_001, Infinity], 0.45],
    ),
    superTaxRate: 0.15,
    declared: new Array(),
    paid: new Array()
});

const bank = new Bank({
    transactions: new Array(),
    interestRate: 0.03
});

const superan = new Super({
    tax: tax,
    transactions: new Array(),
    interestRate: 0.10,
    contributionRate: 0.125,
});

const salary = new Salary({
    tax: tax,
    yearlyGrossSalary: 120_000,
    yearlySalaryIncrease: 0.05,
    creationTime: clock.getTime()
});

const expenses = new Array(
    new Expense({
        yearlyIncrease: 0.03,
        weeklyAmount: 350,
        description: "Living expenses",
        initialTime: 0,
    }),
)

const houses = [
    new House({
        tax: tax,
        downPayment: 50_000,
        loan: 550_0000,
        interestRate: 0.03,
        appreciation: 0.03,
        monthlyRentalIncome: 2_500,
        yearlyRentalIncomeIncrease: 0.03,
        buildingDepreciationRate: 0.02,
        purchaseTime: 0
    }),
    new House({
        tax: tax,
        downPayment: 50_000,
        loan: 550_0000,
        interestRate: 0.03,
        appreciation: 0.03,
        monthlyRentalIncome: 2_500,
        yearlyRentalIncomeIncrease: 0.03,
        buildingDepreciationRate: 0.02,
        purchaseTime: 0
    }),
];

let state = new State({
    clock: clock,
    tax: tax,
    bank: bank,
    superan: superan,
    salary: salary,
    houses: houses,
    stocks: new Array(),
    expenses: expenses,
});

for (let i = 0; i < 12 * 10; i++) {
    state = state.waitOneMonth();

    console.log('Time:', state.getClock().getTime());
    console.log('Salary:', state.getSalary().getYearlyGrossSalary(state.getClock().getTime()));
    console.log('Bank balance:', state.getBank().getBalance(state.getClock().getTime()));
    console.log('Super balance:', state.getSuper().getBalance(state.getClock().getTime()));
    console.log('Monthly rental income:', state.getHouses().reduce((acc, house) => acc + house.getMonthlyGrossRentalIncome(state.getClock().getTime()), 0));
    console.log('Total net worth', state.getNetWealth());
}
