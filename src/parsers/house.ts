import House, { Props } from "../house";

const parser = (obj: Props): House => {
  try {
    return new House({
      houseValue: obj.houseValue as Props["houseValue"],
      loan: obj.loan as Props["loan"],
      yearlyInterestRate: obj.yearlyInterestRate as Props["yearlyInterestRate"],
      yearlyAppreciationRate: obj.yearlyAppreciationRate as Props["yearlyAppreciationRate"],
      monthlyGrossRentalIncome: obj.monthlyGrossRentalIncome as Props["monthlyGrossRentalIncome"],
      yearlyRentalIncomeIncrease: obj.yearlyRentalIncomeIncrease as Props["yearlyRentalIncomeIncrease"],
      buildingDepreciationRate: obj.buildingDepreciationRate as Props["buildingDepreciationRate"],
      purchaseTime: obj.purchaseTime as Props["purchaseTime"],
      description: obj.description as Props["description"],
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
