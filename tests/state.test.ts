import { Clock } from "../src/clock";
import { Tax } from "../src/tax";
import { Bank } from "../src/bank";
import { Salary } from "../src/salary";
import { House } from "../src/house";
import { Stock } from "../src/stock";
import { Super } from "../src/super";
import { State } from "../src/state";
import { Expense } from "../src/expense";


test('correct net wealth for model with salary only', () => {
    const clock = new Clock(0);

    const tax = new Tax({
        declared: new Array(),
        paid: new Array()
    });

    const bank = new Bank({
        transactions: new Array(),
        interestRate: 0.03
    })

    const superan = new Super({
        transactions: new Array(),
        interestRate: 0.1
    })

    const salary = new Salary({
        tax: tax,
        salary: 120_000,
        yearSalaryIncrease: 0.05,
        creationTime: clock.getTime()
    })

    const state = new State(
        {
            clock: clock,
            tax: tax,
            bank: bank,
            superan: superan,
            salaries: new Array(salary),
            houses: new Array(),
            stocks: new Array(),
            expenses: new Array(),
        },
    );

    expect(state.getNetWealth()).toEqual(0);
});


// test('componding monthly correctly', () => {
//     const tax = new Tax({
//         declared: new Array(),
//         paid: new Array()
//     });

//     const state = new State(
//         {
//             clock: new Clock(0),
//             tax: tax,
//             bank: new Bank({
//                 transactions: new Array(),
//                 interestRate: 0.03
//             }),
//             superan: new Super({
//                 transactions: new Array(),
//                 interestRate: 0.1
//             }),
//             salaries: new Array(
//                 new Salary({
//                     tax: tax,
//                     salary: 120_000,
//                     yearSalaryIncrease: 0.05,
//                     creationTime: 0
//                 })),
//             houses: new Array(
//                 new House({
//                     tax: tax,
//                     downPayment: 50000,
//                     loan: 550000,
//                     interestRate: 0.03,
//                     appreciation: 0.03,
//                     monthlyRentalIncome: 2500,
//                     yearlyRentalIncomeIncrease: 0.03,
//                     buildingDepreciation: 0.02,
//                     purchaseTime: 0
//                 })),
//             stocks: new Array(
//                 new Stock({
//                     rateOfReturn: 0.1,
//                     initialTime: 0,
//                     initialPrice: 500,
//                     transactions: new Array()
//                 })),
//             expenses: new Array(
//                 new Expense({
//                     yearlyIncrease: 0.03,
//                     amount: 350,
//                     description: "Living expenses",
//                     initialTime: 0,
//                 }),
//             )
//         },
//     );

//     expect(state.next()).toBeCloseTo(1.03, 10);
// });
