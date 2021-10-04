import House from "../src/house";
import Loan from "../src/loan";

const principalAndInterestLoan = new Loan({
  amountBorrowed: 550_000,
  yearlyInterestRate: 0.03,
  monthlyFee: 30,
  isInterestOnly: false,
  lengthOfLoanInMonths: 12 * 30,
});

const interestOnlyLoan = new Loan({
  amountBorrowed: 550_000,
  yearlyInterestRate: 0.03,
  monthlyFee: 30,
  isInterestOnly: true,
  lengthOfLoanInMonths: 12 * 30,
});

const houseWithPrincipleAndInterestLoan = new House({
  loan: principalAndInterestLoan,
  houseValue: 600_000,
  yearlyAppreciationRate: 0.05,
  monthlyGrossRentalIncome: 2_500,
  yearlyRentalIncomeIncrease: 0.03,
  buildingDepreciationRate: 0.025,
});

const houseWithInterestOnlyLoan = new House({
  loan: interestOnlyLoan,
  houseValue: 600_000,
  yearlyAppreciationRate: 0.05,
  monthlyGrossRentalIncome: 2_500,
  yearlyRentalIncomeIncrease: 0.03,
  buildingDepreciationRate: 0.025,
});

const realisticLoan = new Loan({
  amountBorrowed: 0.9 * 900_000,
  yearlyInterestRate: 0.03,
  monthlyFee: 30,
  isInterestOnly: false,
  lengthOfLoanInMonths: 12 * 30,
});

const realisticHouse = new House({
  loan: realisticLoan,
  houseValue: 900_000,
  yearlyAppreciationRate: 0.04,
  monthlyGrossRentalIncome: 2_500,
  yearlyRentalIncomeIncrease: 0.02,
  buildingDepreciationRate: 0.025,
});

test("house value appreciating correctly", () => {
  expect(
    houseWithPrincipleAndInterestLoan
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .getHouseValue()
  ).toBeCloseTo(
    houseWithPrincipleAndInterestLoan.getHouseValue() *
      Math.pow(
        1 + houseWithPrincipleAndInterestLoan.getYearlyAppreciationRate(),
        5
      ),
    8
  );
});

test("correct monthly appreciation rate", () => {
  expect(
    houseWithPrincipleAndInterestLoan.getYearlyAppreciationRate()
  ).toBeCloseTo(
    Math.pow(
      1 + houseWithPrincipleAndInterestLoan.getMonthlyAppreciationRate(),
      12
    ) - 1,
    8
  );
});

test("house with principle and interest loan's equity is value minus loan value in future", () => {
  expect(houseWithPrincipleAndInterestLoan.getEquity()).toEqual(50_000);

  expect(
    houseWithPrincipleAndInterestLoan
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .getEquity()
  ).toBeCloseTo(
    houseWithPrincipleAndInterestLoan.getHouseValue() *
      Math.pow(
        1 + houseWithPrincipleAndInterestLoan.getYearlyAppreciationRate(),
        3
      ) -
      principalAndInterestLoan
        .waitOneYear()
        .waitOneYear()
        .waitOneYear()
        .getAmountBorrowed(),
    8
  );
});

test("house with interest only loan's equity is value minus loan at start", () => {
  expect(houseWithInterestOnlyLoan.getEquity()).toEqual(50_000);

  expect(
    houseWithInterestOnlyLoan
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .getEquity()
  ).toBeCloseTo(
    houseWithInterestOnlyLoan.getHouseValue() *
      Math.pow(1 + houseWithInterestOnlyLoan.getYearlyAppreciationRate(), 3) -
      interestOnlyLoan.getAmountBorrowed(),
    8
  );
});

test("sanity test for house equity with P&I loan", () => {
  const futureHouse = realisticHouse
    .waitOneYear()
    .waitOneYear()
    .waitOneYear()
    .waitOneYear()
    .waitOneYear()
    .waitOneYear()
    .waitOneYear()
    .waitOneYear()
    .waitOneYear()
    .waitOneYear();

  expect(futureHouse.getEquity()).toBeGreaterThan(
    realisticHouse.getEquity() * Math.pow(1.16, 10)
  );

  expect(futureHouse.getEquity()).toBeLessThan(
    realisticHouse.getEquity() * Math.pow(1.24, 10)
  );
});

test("sanity test for house equity with interest only loan", () => {
  const futureHouse = realisticHouse
    .waitOneYear()
    .waitOneYear()
    .waitOneYear()
    .waitOneYear()
    .waitOneYear()
    .waitOneYear()
    .waitOneYear()
    .waitOneYear()
    .waitOneYear()
    .waitOneYear();

  expect(futureHouse.getEquity()).toBeGreaterThan(
    realisticHouse.getEquity() * Math.pow(1.16, 10)
  );

  expect(futureHouse.getEquity()).toBeLessThan(
    realisticHouse.getEquity() * Math.pow(1.24, 10)
  );
});

test("house rental income grows correctly", () => {
  expect(
    houseWithPrincipleAndInterestLoan.getMonthlyGrossRentalIncome()
  ).toEqual(2_500);

  expect(
    houseWithPrincipleAndInterestLoan
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .getMonthlyGrossRentalIncome()
  ).toBeCloseTo(2_500 * Math.pow(1.03, 3), 8);
});

test("correct monthly interest payments", () => {
  expect(houseWithPrincipleAndInterestLoan.getMonthlyInterestPayment()).toEqual(
    principalAndInterestLoan.getMonthlyPayment()
  );
});

test("correct monthly depreciation rate", () => {
  expect(
    Math.pow(
      1 + houseWithPrincipleAndInterestLoan.getMonthlyDepreciationRate(),
      12
    ) - 1
  ).toBeCloseTo(0.025, 10);
});

test("monthly depreciation amount is in sensible range", () => {
  const [amount] = Array(...Array(12).keys()).reduce(
    ([accAmount, accHouse]: [number, House]) => [
      accAmount + accHouse.getMonthlyDepreciationAmount(),
      houseWithPrincipleAndInterestLoan.waitOneMonth(),
    ],
    [0, houseWithPrincipleAndInterestLoan]
  );

  expect(amount).toBeGreaterThanOrEqual(
    0.66 *
      houseWithPrincipleAndInterestLoan.getHouseValue() *
      houseWithPrincipleAndInterestLoan.getMonthlyDepreciationRate() *
      12
  );

  expect(amount).toBeLessThanOrEqual(
    0.66 *
      houseWithPrincipleAndInterestLoan.waitOneYear().getHouseValue() *
      houseWithPrincipleAndInterestLoan.getMonthlyDepreciationRate() *
      12
  );
});

test("can compare houses as JSON objects", () => {
  expect(
    JSON.stringify(houseWithPrincipleAndInterestLoan) ===
      JSON.stringify(houseWithPrincipleAndInterestLoan)
  ).toBeTruthy;
});

test("correct capital gain", () => {
  expect(houseWithPrincipleAndInterestLoan.getCapitalGain()).toBeCloseTo(0, 10);

  expect(
    houseWithPrincipleAndInterestLoan.waitOneYear().getCapitalGain()
  ).toBeCloseTo(
    houseWithPrincipleAndInterestLoan.getHouseValue() *
      Math.pow(
        1 + houseWithPrincipleAndInterestLoan.getMonthlyAppreciationRate(),
        12
      ) -
      houseWithPrincipleAndInterestLoan.getHouseValue(),
    8
  );

  expect(
    houseWithPrincipleAndInterestLoan
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .getCapitalGain()
  ).toBeCloseTo(
    houseWithPrincipleAndInterestLoan.getHouseValue() *
      Math.pow(
        1 + houseWithPrincipleAndInterestLoan.getMonthlyAppreciationRate(),
        48
      ) -
      houseWithPrincipleAndInterestLoan.getHouseValue(),
    8
  );
});

test("correctly refinances loan from interest only to principle and interest", () => {
  expect(
    houseWithPrincipleAndInterestLoan.refinanceLoan(interestOnlyLoan).getLoan()
  ).toStrictEqual(interestOnlyLoan);

  expect(
    houseWithPrincipleAndInterestLoan
      .refinanceLoan(interestOnlyLoan)
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .waitOneMonth()
  ).toStrictEqual(
    houseWithInterestOnlyLoan
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .waitOneMonth()
  );
});
