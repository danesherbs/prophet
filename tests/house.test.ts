import House from "../src/house";


const house = new House({
    loan: 550_000,
    houseValue: 600_000,
    interestRate: 0.03,
    yearlyAppreciationRate: 0.05,
    monthlyRentalIncome: 2_500,
    yearlyRentalIncomeIncrease: 0.03,
    buildingDepreciationRate: 0.025,
    purchaseTime: 0
});

test('house value appreciating correctly', () => {
    expect(house.getHouseValue(36))
        .toBeCloseTo(600_000 * Math.pow(1.05, 3), 8);
});

test('correct monthly appreciation rate', () => {
    expect(house.getYearlyAppreciationRate())
        .toBeCloseTo(Math.pow(1 + house.getMonthlyAppreciationRate(), 12) - 1, 8);
});

test('house equity is value minus loan', () => {
    expect(house.getEquity(0))
        .toEqual(50_000);

    expect(house.getEquity(36))
        .toBeCloseTo(600_000 * Math.pow(1 + house.getYearlyAppreciationRate(), 3) - 550_000, 8);
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

test('monthly depreciation amount is in sensible range', () => {
    const amount = Array(...Array(12).keys())
        .reduce((acc: number, month: number) => acc + house.getMonthlyDepreciationAmount(month), 0);

    expect(amount)
        .toBeGreaterThanOrEqual(0.66 * house.getHouseValue(0) * house.getMonthlyDepreciationRate() * 12);

    expect(amount)
        .toBeLessThanOrEqual(0.66 * house.getHouseValue(12) * house.getMonthlyDepreciationRate() * 12);
});

test('can compare houses as JSON objects', () => {
    expect(JSON.stringify(house) === JSON.stringify(house))
        .toBeTruthy;
});

test('correct capital gain', () => {
    expect(house.getCapitalGain(0))
        .toBeCloseTo(0, 10);

    expect(house.getCapitalGain(12))
        .toBeCloseTo(600_000 * Math.pow(1 + house.getMonthlyAppreciationRate(), 12) - 600_000, 10);

    expect(house.getCapitalGain(56))
        .toBeCloseTo(600_000 * Math.pow(1 + house.getMonthlyAppreciationRate(), 56) - 600_000, 10);
});
