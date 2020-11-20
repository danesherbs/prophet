import { Clock } from "../src/clock";
import { Tax, TaxType } from "../src/tax";
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
        [[0.0, 50_000], 0.0],
        [[50_001, Infinity], 0.2],
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
    yearlyGrossSalary: 120_000,
    yearlySalaryIncrease: 0.05,
    creationTime: clock.getTime()
});

const house = new House({
    tax: tax,
    downPayment: 50_000,
    loan: 550_000,
    interestRate: 0.03,
    appreciation: 0.03,
    monthlyRentalIncome: 2_500,
    yearlyRentalIncomeIncrease: 0.03,
    buildingDepreciationRate: 0.025,
    purchaseTime: 0
});


test('correct salary transition', () => {
    const state = new State({
        clock: clock,
        tax: tax,
        bank: bank,
        superan: superan,
        salary: salary,
        houses: new Array(),
        stocks: new Array(),
        expenses: new Array(),
    });

    expect(state.receiveMonthlySalaryPayment(salary).getBank().getBalance(0)).toBeCloseTo(salary.getMonthlyNetSalary(0), 10);
    expect(state.receiveMonthlySalaryPayment(salary).getSuper().getBalance(0)).toBeCloseTo(superan.getMonthlyNetSuperContribution(salary.getYearlyGrossSalary(0)), 10);
    // expect(state.registerSalary(salary).getTax().getTaxRecords()).toEqual(new Array([0, 100, TaxType.Income], [0, 100, TaxType.Super]));
});

test('correct net wealth with salary only', () => {
    const state = new State({
        clock: clock,
        tax: tax,
        bank: bank,
        superan: superan,
        salary: salary,
        houses: new Array(),
        stocks: new Array(),
        expenses: new Array(),
    });

    expect(state.getNetWealth())
        .toEqual(0);

    expect(state.waitOneMonth().getNetWealth())
        .toBeCloseTo(
            salary.getMonthlyNetSalary(1) * (1 + bank.getMonthlyInterestRate()) +
            superan.getMonthlyNetSuperContribution(120_000) * (1 + superan.getMonthlyInterestRate())
            , 10);

    expect(state.waitOneMonth().waitOneMonth().getNetWealth())
        .toBeCloseTo(
            salary.getMonthlyNetSalary(1) * (1 + bank.getMonthlyInterestRate()) +
            salary.getMonthlyNetSalary(2) * Math.pow(1 + bank.getMonthlyInterestRate(), 2) +
            superan.getMonthlyNetSuperContribution(120_000) * (1 + superan.getMonthlyInterestRate()) +
            superan.getMonthlyNetSuperContribution(120_000) * Math.pow(1 + superan.getMonthlyInterestRate(), 2)
            , 10);
});

test('correct state change when buying stock', () => {
    const stock = new Stock({
        rateOfReturn: 0.1,
        initialTime: 0,
        initialPrice: 500,
        transactions: [[0, 10]],
    });

    const state = new State({
        clock: clock,
        tax: tax,
        bank: bank,
        superan: superan,
        salary: salary,
        houses: new Array(),
        stocks: [stock],
        expenses: new Array(),
    });

    // Unchanged
    expect(state.buyStock(stock).getClock()).toEqual(state.getClock());
    expect(state.buyStock(stock).getHouses()).toEqual(state.getHouses());
    expect(state.buyStock(stock).getSuper()).toEqual(state.getSuper());
    expect(state.buyStock(stock).getTax()).toEqual(state.getTax());
    expect(state.buyStock(stock).getSalary()).toEqual(state.getSalary());

    // Changed
    expect(state.buyStock(stock).getStocks()).toEqual([stock, stock]);
    expect(state.buyStock(stock).getBank().getBalance(0)).toEqual(state.getBank().getBalance(0) - 5_000);
});

test('correct state change when buying a house', () => {
    const state = new State({
        clock: clock,
        tax: tax,
        bank: bank,
        superan: superan,
        salary: salary,
        houses: [house],
        stocks: new Array(),
        expenses: new Array(),
    });

    // Unchanged
    expect(state.buyHouse(house).getClock()).toEqual(state.getClock());
    expect(state.buyHouse(house).getStocks()).toEqual(state.getStocks());
    expect(state.buyHouse(house).getSuper()).toEqual(state.getSuper());
    expect(state.buyHouse(house).getTax()).toEqual(state.getTax());
    expect(state.buyHouse(house).getSalary()).toEqual(state.getSalary());

    // Changed
    expect(state.buyHouse(house).getHouses()).toEqual([house, house]);
    expect(state.buyHouse(house).getBank().getBalance(0)).toEqual(state.getBank().getBalance(0) - 50_000);
});

test('correct state change after one month when owning single house', () => {
    const salary = new Salary({
        tax: tax,
        yearlyGrossSalary: 0,
        yearlySalaryIncrease: 0,
        creationTime: clock.getTime()
    });

    const state = new State({
        clock: clock,
        tax: tax,
        bank: bank,
        superan: superan,
        salary: salary,
        houses: [house],
        stocks: new Array(),
        expenses: new Array(),
    });

    // Unchanged
    expect(state.waitOneMonth().getStocks())
        .toEqual(state.getStocks());

    expect(state.waitOneMonth().getSuper())
        .toEqual(state.getSuper());

    expect(state.waitOneMonth().getSalary())
        .toEqual(state.getSalary());

    expect(state.waitOneMonth().getHouses())
        .toEqual(state.getHouses());

    // Changed
    expect(state.waitOneMonth().getClock().getTime())
        .toEqual(1);

    expect(state.waitOneMonth().getTax())
        .toEqual(state.getTax()
            .declareIncome(0, 2_500)
            .declareLoss(0, house.getMonthlyDepreciationAmount(0)));

    expect(state.waitOneMonth().getBank().getBalance(1))
        .toEqual(state.getBank()
            .deposit(0, house.getMonthlyGrossRentalIncome(0), "Rental income")
            .withdraw(0, house.getMonthlyInterestPayment(), "Interest payment")
            .getBalance(0) * (1 + bank.getMonthlyInterestRate()));
});

test('unpaid tax is paid back at beginning of financial year', () => {
    const house = new House({
        tax: tax,
        downPayment: 50_000,
        loan: 550_000,
        interestRate: 0.03,
        appreciation: 0.03,
        monthlyRentalIncome: 5_000,
        yearlyRentalIncomeIncrease: 0.03,
        buildingDepreciationRate: 0.025,
        purchaseTime: 0
    });

    const state = new State({
        clock: clock,
        tax: tax,
        bank: bank,
        superan: superan,
        salary: salary,
        houses: [house],
        stocks: new Array(),
        expenses: new Array(),
    });

    expect(state.waitOneYear().waitOneMonth().getClock().getTime())
        .toEqual(13);

    expect(state.waitOneYear().waitOneMonth().getBank().getTransactions()
        .reduce((acc, [, , info]) => acc || info === "Tax correction", false))
        .toBeTruthy();

    const [time, amount, description] = state.waitOneYear().waitOneMonth().getBank().getTransactions().find(([, , info]) => info === "Tax correction") as [number, number, string];

    expect(time).toEqual(12);
    expect(amount).toBeCloseTo(-state.waitOneYear().waitOneMonth().getTax().getNetUnpaidTaxOverLastTwelveMonths(11), 10);
    expect(description).toEqual("Tax correction");
});
