import House from "../src/house";
import Loan from "../src/loan";

const loan = new Loan({
  amountBorrowed: 550_000,
  yearlyInterestRate: 0.03,
  monthlyFee: 30,
  isInterestOnly: false,
  lengthOfLoanInMonths: 12 * 30,
});

const house = new House({
  loan: loan,
  houseValue: 600_000,
  yearlyInterestRate: 0.03,
  yearlyAppreciationRate: 0.05,
  monthlyGrossRentalIncome: 2_500,
  yearlyRentalIncomeIncrease: 0.03,
  buildingDepreciationRate: 0.025,
});

test("house value appreciating correctly", () => {
  expect(
    house
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .getHouseValue()
  ).toBeCloseTo(600_000 * Math.pow(1.05, 5), 8);
});

test("correct monthly appreciation rate", () => {
  expect(house.getYearlyAppreciationRate()).toBeCloseTo(
    Math.pow(1 + house.getMonthlyAppreciationRate(), 12) - 1,
    8
  );
});

test("house equity is value minus loan", () => {
  expect(house.getEquity()).toEqual(50_000);

  expect(
    house.waitOneYear().waitOneYear().waitOneYear().getEquity()
  ).toBeCloseTo(
    600_000 * Math.pow(1 + house.getYearlyAppreciationRate(), 3) - 550_000,
    8
  );
});

test("house rental income grows correctly", () => {
  expect(house.getMonthlyGrossRentalIncome()).toEqual(2_500);

  expect(
    house
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .getMonthlyGrossRentalIncome()
  ).toBeCloseTo(2_500 * Math.pow(1.03, 3), 8);
});

test("correct monthly interest rate", () => {
  expect(Math.pow(1 + house.getMonthlyInterestRate(), 12)).toBeCloseTo(
    1.03,
    10
  );
});

test("correct monthly interest payments", () => {
  expect(house.getMonthlyInterestPayment()).toEqual(
    loan.getMonthlyPrincipleAndInterestPayment()
  );
});

test("correct monthly depreciation rate", () => {
  expect(Math.pow(1 + house.getMonthlyDepreciationRate(), 12) - 1).toBeCloseTo(
    0.025,
    10
  );
});

test("monthly depreciation amount is in sensible range", () => {
  const [amount] = Array(...Array(12).keys()).reduce(
    ([accAmount, accHouse]: [number, House]) => [
      accAmount + accHouse.getMonthlyDepreciationAmount(),
      house.waitOneMonth(),
    ],
    [0, house]
  );

  expect(amount).toBeGreaterThanOrEqual(
    0.66 * house.getHouseValue() * house.getMonthlyDepreciationRate() * 12
  );

  expect(amount).toBeLessThanOrEqual(
    0.66 *
      house.waitOneYear().getHouseValue() *
      house.getMonthlyDepreciationRate() *
      12
  );
});

test("can compare houses as JSON objects", () => {
  expect(JSON.stringify(house) === JSON.stringify(house)).toBeTruthy;
});

test("correct capital gain", () => {
  expect(house.getCapitalGain()).toBeCloseTo(0, 10);

  expect(house.waitOneYear().getCapitalGain()).toBeCloseTo(
    house.getHouseValue() *
      Math.pow(1 + house.getMonthlyAppreciationRate(), 12) -
      house.getHouseValue(),
    8
  );

  expect(
    house
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .getCapitalGain()
  ).toBeCloseTo(
    house.getHouseValue() *
      Math.pow(1 + house.getMonthlyAppreciationRate(), 48) -
      house.getHouseValue(),
    8
  );
});
