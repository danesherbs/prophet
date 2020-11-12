import { Clock } from "../src/clock";
import { Tax } from "../src/tax";
import { Bank } from "../src/bank";
import { Salary } from "../src/salary";
import { House } from "../src/house";
import { Stock } from "../src/stock";
import { Super } from "../src/super";
import { State } from "../src/state";
import { Expense } from "../src/expense";


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
    interestRate: 0.1,
    contributionRate: 0.125,
});

const salary = new Salary({
    tax: tax,
    salary: 120_000,
    yearlySalaryIncrease: 0.05,
    creationTime: clock.getTime()
});

const houses = new Array(
    // new House({
    //     tax: tax,
    //     downPayment: 50000,
    //     loan: 550000,
    //     interestRate: 0.03,
    //     appreciation: 0.03,
    //     monthlyRentalIncome: 2500,
    //     yearlyRentalIncomeIncrease: 0.03,
    //     buildingDepreciation: 0.02,
    //     purchaseTime: 0
    // }),
);

const stocks = new Array(
    // new Stock({
    //     rateOfReturn: 0.1,
    //     initialTime: 0,
    //     initialPrice: 500,
    //     transactions: new Array()
    // }),
);

const expenses = new Array(
    new Expense({
        yearlyIncrease: 0.03,
        weeklyAmount: 350,
        description: "Living expenses",
        initialTime: 0,
    }),
)

let state = new State({
    clock: clock,
    tax: tax,
    bank: bank,
    superan: superan,
    salary: salary,
    houses: houses,
    stocks: stocks,
    expenses: expenses,
});

for (let i = 0; i < 12 * 10; i++) {
    state = state.waitOneMonth();

    console.log('Time:', state.getClock().getTime());
    console.log('Salary:', state.getSalary().getYearlyGrossSalary(state.getClock().getTime()));
    console.log('Bank balance:', state.getBank().getBalance(state.getClock().getTime()));
    console.log('Super balance:', state.getSuper().getBalance(state.getClock().getTime()));
    console.log('Total net worth', state.getNetWealth());
}
