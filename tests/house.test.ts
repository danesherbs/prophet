import { House } from "../src/house";
import { Tax } from "../src/tax";


test('house value appreciating correctly', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
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

    expect(house.getHouseValue(36)).toBeCloseTo(600_000 * Math.pow(1.03, 3), 8);
});

test('house equity is value minus loan', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
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

    expect(house.getEquity(0)).toEqual(50_000);
    expect(house.getEquity(36)).toBeCloseTo(600_000 * Math.pow(1.03, 3) - 550_000, 8);
});

test('house rental income grows correctly', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
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

    expect(house.getMonthlyGrossRentalIncome(0)).toEqual(2_500);
    expect(house.getMonthlyGrossRentalIncome(36)).toBeCloseTo(2_500 * Math.pow(1.03, 3), 8);
});

test('correct monthly interest rate', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
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

    expect(Math.pow(1 + house.getMonthlyInterestRate(), 12)).toBeCloseTo(1.03, 10);
});

test('correct monthly interest payments', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
    });

    const house = new House({
        tax: tax,
        downPayment: 50_000,
        loan: 100_000,
        interestRate: 0.03,
        appreciation: 0.03,
        monthlyRentalIncome: 2_500,
        yearlyRentalIncomeIncrease: 0.03,
        buildingDepreciationRate: 0.025,
        purchaseTime: 0
    });

    expect(house.getMonthlyInterestPayment()).toEqual(250);
});

test('correct yearly depreciation amount', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
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

    expect(house.getYearlyDepreciationAmount(0)).toEqual(600_000 * 0.025);
    expect(house.getYearlyDepreciationAmount(36)).toBeCloseTo(600_000 * Math.pow(1.03, 3) * 0.025, 8);
});
