import { Clock } from "../src/clock";
import { Tax, TaxType } from "../src/tax";
import { Bank } from "../src/bank";
import { Salary } from "../src/salary";
import { House } from "../src/house";
import { Stock } from "../src/stock";
import { Super } from "../src/super";
import { State } from "../src/state";
import { Expense } from "../src/expense";
import * as _ from 'lodash';


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

const expense = new Expense({
    yearlyIncrease: 0.03,
    weeklyAmount: 240,
    description: "Living expenses",
    initialTime: clock.getTime(),
})

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

const stock = new Stock({
    rateOfReturn: 0.1,
    initialTime: 0,
    initialPrice: 500,
    transactions: [[0, 10]],
});

test('getters are working correctly', () => {
    const state = new State({
        clock: clock,
        tax: tax,
        bank: bank,
        superan: superan,
        salary: salary,
        houses: [house, house],
        stocks: [stock, stock],
        expenses: [expense],
    });

    expect(state.getClock())
        .toEqual(clock);

    expect(state.getTax())
        .toEqual(tax);

    expect(state.getBank())
        .toEqual(bank);

    expect(state.getSuper())
        .toEqual(superan);

    expect(state.getHouses())
        .toEqual([house, house]);

    expect(state.getStocks())
        .toEqual([stock, stock]);

    expect(state.getExpenses())
        .toEqual([expense]);
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

    expect(state.receiveMonthlySalaryPayment(salary).getBank().getBalance(0))
        .toBeCloseTo(salary.getMonthlyNetSalary(0), 10);

    expect(state.receiveMonthlySalaryPayment(salary).getSuper().getBalance(0))
        .toBeCloseTo(superan.getMonthlyNetSuperContribution(salary.getYearlyGrossSalary(0)), 10);

    expect(state.receiveMonthlySalaryPayment(salary).getTax())
        .toEqual(state.getTax()
            .declareIncome(0, salary.getMonthlyGrossSalary(0))
            .payTax(0, tax.getMonthlyIncomeTax(salary.getYearlyGrossSalary(0)), TaxType.Income)
            .payTax(0, tax.superTaxRate * superan.getMonthlyGrossSuperContribution(salary.getYearlyGrossSalary(0)), TaxType.Super));
});

test('correct net wealth after a month with salary only', () => {
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
            salary.getMonthlyNetSalary(0) * (1 + bank.getMonthlyInterestRate()) +
            superan.getMonthlyNetSuperContribution(120_000) * (1 + superan.getMonthlyInterestRate())
            , 10);

    expect(state.waitOneMonth().waitOneMonth().getNetWealth())
        .toBeCloseTo(
            salary.getMonthlyNetSalary(0) * Math.pow(1 + bank.getMonthlyInterestRate(), 2) +
            salary.getMonthlyNetSalary(1) * (1 + bank.getMonthlyInterestRate()) +
            superan.getMonthlyNetSuperContribution(120_000) * (1 + superan.getMonthlyInterestRate()) +
            superan.getMonthlyNetSuperContribution(120_000) * Math.pow(1 + superan.getMonthlyInterestRate(), 2)
            , 10);
});

test('correct net wealth after a month with salary and expense', () => {
    const state = new State({
        clock: clock,
        tax: tax,
        bank: bank,
        superan: superan,
        salary: salary,
        houses: new Array(),
        stocks: new Array(),
        expenses: [expense],
    });

    expect(state.getNetWealth())
        .toEqual(0);

    expect(state.waitOneMonth().getNetWealth())
        .toBeCloseTo(
            (salary.getMonthlyNetSalary(0) - expense.getMonthlyAmount(0)) * (1 + bank.getMonthlyInterestRate())
            + superan.getMonthlyNetSuperContribution(120_000) * (1 + superan.getMonthlyInterestRate())
            , 10);

    expect(state.waitOneMonth().waitOneMonth().getNetWealth())
        .toBeCloseTo(
            (salary.getMonthlyNetSalary(1) - expense.getMonthlyAmount(1)) * Math.pow(1 + bank.getMonthlyInterestRate(), 2) +
            (salary.getMonthlyNetSalary(0) - expense.getMonthlyAmount(0)) * (1 + bank.getMonthlyInterestRate()) +
            superan.getMonthlyNetSuperContribution(120_000) * (1 + superan.getMonthlyInterestRate()) +
            superan.getMonthlyNetSuperContribution(120_000) * Math.pow(1 + superan.getMonthlyInterestRate(), 2)
            , 10);
});

test('correct net wealth after a month with salary, house, stock and expense', () => {
    const state = new State({
        clock: clock,
        tax: tax,
        bank: bank,
        superan: superan,
        salary: salary,
        houses: [house],
        stocks: [stock],
        expenses: [expense],
    });

    expect(state.getNetWealth())
        .toEqual(house.getEquity(0) + stock.getInitialPrice() * stock.getNumberOfUnits());

    expect(state.waitOneMonth().getNetWealth())
        .toBeCloseTo(
            (salary.getMonthlyNetSalary(0)
                + house.getMonthlyGrossRentalIncome(0)
                - expense.getMonthlyAmount(0)
                - house.getMonthlyInterestPayment()
            ) * (1 + bank.getMonthlyInterestRate())
            + superan.getMonthlyNetSuperContribution(120_000) * (1 + superan.getMonthlyInterestRate())
            + house.getEquity(1)
            + stock.getPrice(1) * stock.getNumberOfUnits()
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
    expect(state.buyStock(stock).getClock())
        .toEqual(state.getClock());

    expect(state.buyStock(stock).getHouses())
        .toEqual(state.getHouses());

    expect(state.buyStock(stock).getSuper())
        .toEqual(state.getSuper());

    expect(state.buyStock(stock).getTax())
        .toEqual(state.getTax());

    expect(state.buyStock(stock).getSalary())
        .toEqual(state.getSalary());

    // Changed
    expect(state.buyStock(stock).getStocks())
        .toEqual([stock, stock]);

    expect(state.buyStock(stock).getBank().getBalance(0))
        .toEqual(state.getBank().getBalance(0) - 5_000);
});

test('correct state change when selling stock', () => {
    const state = new State({
        clock: clock,
        tax: tax,
        bank: bank,
        superan: superan,
        salary: salary,
        houses: new Array(),
        stocks: [stock, stock],
        expenses: new Array(),
    });

    // Unchanged
    expect(state.sellStock(stock).getClock())
        .toEqual(state.getClock());

    expect(state.sellStock(stock).getHouses())
        .toEqual(state.getHouses());

    expect(state.sellStock(stock).getSuper())
        .toEqual(state.getSuper());

    expect(state.sellStock(stock).getSalary())
        .toEqual(state.getSalary());

    // Changed
    expect(state.getStocks())
        .toEqual([stock, stock]);

    expect(state.sellStock(stock).getStocks())
        .toEqual([stock]);

    expect(state.sellStock(stock).getBank().getBalance(0))
        .toEqual(5_000);

    expect(state.sellStock(stock).getTax())
        .toEqual(state.getTax().declareIncome(0, 0));

    // Changed after one month
    expect(state.waitOneMonth().getStocks())
        .toEqual([stock, stock]);

    expect(state.waitOneMonth().sellStock(stock).getStocks())
        .toEqual([stock]);

    expect(state.waitOneMonth().sellStock(stock).getBank().getBalance(1))
        .toBeCloseTo(
            salary.getMonthlyNetSalary(0) * (1 + bank.getMonthlyInterestRate())
            + stock.getPrice(1) * stock.getNumberOfUnits(), 10);

    expect(state.waitOneMonth().sellStock(stock).getTax())
        .toEqual(
            state.getTax()
                .declareIncome(0, salary.getMonthlyGrossSalary(0))
                .payTax(0, tax.getMonthlyIncomeTax(salary.getYearlyGrossSalary(0)), TaxType.Income)
                .payTax(0, salary.getYearlyGrossSalary(0) * superan.contributionRate * tax.superTaxRate / 12, TaxType.Super)
                .declareIncome(1, (stock.getPrice(1) - stock.getInitialPrice()) * stock.getNumberOfUnits()));
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
    expect(state.buyHouse(house).getClock())
        .toEqual(state.getClock());

    expect(state.buyHouse(house).getStocks())
        .toEqual(state.getStocks());

    expect(state.buyHouse(house).getSuper())
        .toEqual(state.getSuper());

    expect(state.buyHouse(house).getTax())
        .toEqual(state.getTax());

    expect(state.buyHouse(house).getSalary())
        .toEqual(state.getSalary());

    // Changed
    expect(state.buyHouse(house).getHouses())
        .toEqual([house, house]);

    expect(state.buyHouse(house).getBank().getBalance(0))
        .toEqual(state.getBank().getBalance(0) - 50_000);
});

test('correct state change when selling a house', () => {
    const state = new State({
        clock: clock,
        tax: tax,
        bank: bank,
        superan: superan,
        salary: salary,
        houses: [house, house],
        stocks: new Array(),
        expenses: new Array(),
    });

    // Unchanged
    expect(state.sellHouse(house).getClock())
        .toEqual(state.getClock());

    expect(state.sellHouse(house).getStocks())
        .toEqual(state.getStocks());

    expect(state.sellHouse(house).getSuper())
        .toEqual(state.getSuper());

    expect(state.sellHouse(house).getSalary())
        .toEqual(state.getSalary());

    // Changed
    expect(state.getHouses())
        .toEqual([house, house]);

    expect(state.sellHouse(house).getHouses())
        .toEqual([house]);

    expect(state.sellHouse(house).getBank().getBalance(0))
        .toEqual(state.getBank().getBalance(0) + 50_000);

    expect(state.sellHouse(house).getTax())
        .toEqual(state.getTax().declareIncome(0, 0));

    // Changed after one month
    expect(state.waitOneMonth().getHouses())
        .toEqual([house, house]);

    expect(state.waitOneMonth().sellHouse(house).getHouses())
        .toEqual([house]);

    expect(state.waitOneMonth().sellHouse(house).getBank().getBalance(1))
        .toBeCloseTo(
            state.waitOneMonth().getBank().getBalance(1)
            + house.getEquity(1), 10);

    expect(state.waitOneMonth().sellHouse(house).getTax())
        .toEqual(state.waitOneMonth().getTax().declareIncome(1, house.getCapitalGain(1)));
});

test('correct bank change after one month with salary and a house', () => {
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

    expect(state.getBank().getBalance(0))
        .toEqual(0);

    expect(state.waitOneMonth().sellHouse(house).getBank().getBalance(1))
        .toBeCloseTo(
            (
                state.getBank().getBalance(0)
                + salary.getMonthlyNetSalary(0)
                + house.getMonthlyGrossRentalIncome(0)
                - house.getMonthlyInterestPayment()
            ) * (1 + bank.getMonthlyInterestRate())
            + house.getEquity(1), 10);
});

test('correct state change when paying an expense', () => {
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

    // Unchanged
    expect(state.payMonthlyExpense(expense).getClock())
        .toEqual(state.getClock());

    expect(state.payMonthlyExpense(expense).getStocks())
        .toEqual(state.getStocks());

    expect(state.payMonthlyExpense(expense).getSuper())
        .toEqual(state.getSuper());

    expect(state.payMonthlyExpense(expense).getTax())
        .toEqual(state.getTax());

    expect(state.payMonthlyExpense(expense).getSalary())
        .toEqual(state.getSalary());

    expect(state.payMonthlyExpense(expense).getHouses())
        .toEqual(state.getHouses());

    // Changed
    expect(state.payMonthlyExpense(expense).getBank().getBalance(0))
        .toEqual(state.getBank().getBalance(0) - (240 * 52) / 12);
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

test('unpaid tax is paid at beginning of financial year', () => {
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
        .toBeTruthy();  // tax correction is in bank transaction history

    const [time, amount,] = state
        .waitOneYear()
        .waitOneMonth()
        .getBank()
        .getTransactions()
        .find(([, , info]) => info === "Tax correction") as [number, number, string];

    expect(time)
        .toEqual(12);  // tax paid at start of financial year

    expect(amount)
        .toBeCloseTo(-state.waitOneYear().waitOneMonth().getTax().getNetUnpaidTaxOverLastTwelveMonths(11), 10);  // amount was unpaid tax of last financial year
});

test('can borrow a small multiple of your salary', () => {
    const house = new House({
        tax: tax,
        downPayment: 50_000,
        loan: 800_000,
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

    expect(state.isValidLoans())
        .toBeTruthy();

    expect(state.isValid())
        .toBeTruthy();
});

test('cant borrow much more than your salary', () => {
    const house = new House({
        tax: tax,
        downPayment: 50_000,
        loan: 1_400_000,
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

    expect(state.isValidLoans())
        .toBeFalsy();

    expect(state.isValid())
        .toBeFalsy();
});

test('cant have negative bank balance', () => {
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

    expect(state.buyHouse(house).getBank().getBalance(0) < 0)
        .toBeTruthy();

    expect(state.buyHouse(house).isValid())
        .toBeFalsy();
});
