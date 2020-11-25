import { House } from "../src/house";
import { Tax } from "../src/tax";


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

test('house value appreciating correctly', () => {
    expect(house.getHouseValue(36))
        .toBeCloseTo(600_000 * Math.pow(1.03, 3), 8);
});

test('house equity is value minus loan', () => {
    expect(house.getEquity(0))
        .toEqual(50_000);

    expect(house.getEquity(36))
        .toBeCloseTo(600_000 * Math.pow(1.03, 3) - 550_000, 8);
});

test('house rental income grows correctly', () => {
    expect(house.getMonthlyGrossRentalIncome(0))
        .toEqual(2_500);

    expect(house.getMonthlyGrossRentalIncome(36))
        .toBeCloseTo(2_500 * Math.pow(1.03, 3), 8);
});

test('correct monthly interest rate', () => {
    expect(Math.pow(1 + house.getMonthlyInterestRate(), 12))
        .toBeCloseTo(1.03, 10);
});

test('correct monthly interest payments', () => {
    expect(house.getMonthlyInterestPayment())
        .toEqual(1_375);
});

test('correct monthly depreciation rate', () => {
    expect(Math.pow(1 + house.getMonthlyDepreciationRate(), 12) - 1)
        .toBeCloseTo(0.025, 10);
});

test('correct monthly depreciation amount', () => {
    expect(Array(...Array(12).keys())
        .reduce((acc: number, month: number) => acc + house.getMonthlyDepreciationAmount(month), 0))
        .toBeCloseTo(9922.21, 2);

    expect(Array(...Array(36).keys())
        .reduce((acc: number, month: number) => acc + house.getMonthlyDepreciationAmount(month), 0))
        .toBeCloseTo(30668.57, 2);
});

test('can compare houses as JSON objects', () => {
    expect(JSON.stringify(house) === JSON.stringify(house))
        .toBeTruthy;
});

test('correct capital gain', () => {
    expect(house.getCapitalGain(0))
        .toBeCloseTo(0, 10);

    expect(house.getCapitalGain(12))
        .toBeCloseTo(600_000 * Math.pow(1 + house.getMonthlyInterestRate(), 12) - 600_000, 10);

    expect(house.getCapitalGain(56))
        .toBeCloseTo(600_000 * Math.pow(1 + house.getMonthlyInterestRate(), 56) - 600_000, 10);
});
