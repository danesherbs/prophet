import House, { Props } from "../house";

const parser = (obj: Object): House | null => {
  try {
    return new House({
      houseValue: Object(obj).houseValue as Props["houseValue"],
      loan: Object(obj).loan as Props["loan"],
      yearlyInterestRate: Object(obj)
        .yearlyInterestRate as Props["yearlyInterestRate"],
      yearlyAppreciationRate: Object(obj)
        .yearlyAppreciationRate as Props["yearlyAppreciationRate"],
      monthlyGrossRentalIncome: Object(obj)
        .monthlyGrossRentalIncome as Props["monthlyGrossRentalIncome"],
      yearlyRentalIncomeIncrease: Object(obj)
        .yearlyRentalIncomeIncrease as Props["yearlyRentalIncomeIncrease"],
      buildingDepreciationRate: Object(obj)
        .buildingDepreciationRate as Props["buildingDepreciationRate"],
      purchaseTime: Object(obj).purchaseTime as Props["purchaseTime"],
      description: Object(obj).description as Props["description"],
    });
  } catch (error) {
    console.log("Couldn't parse", obj);
  }

  return null;
};

export default parser;
