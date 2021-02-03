import House from "../../src/house";
import parser from "../../src/parsers/house";

const house = new House({
  loan: 550_000,
  houseValue: 600_000,
  yearlyInterestRate: 0.03,
  yearlyAppreciationRate: 0.05,
  monthlyGrossRentalIncome: 2_500,
  yearlyRentalIncomeIncrease: 0.03,
  buildingDepreciationRate: 0.025,
  purchaseTime: 0,
});

const data = JSON.parse(JSON.stringify(house));

test("house object is correctly parsed", () => {
  expect(parser(data)).toStrictEqual(house);
});
