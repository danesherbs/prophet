import House, { Props } from "../house";
import { toInteger, toNumber } from "lodash";

const parser = (obj: Props): House => {
  try {
    return new House({
      houseValue: toInteger(obj.houseValue) as Props["houseValue"],
      loan: toInteger(obj.loan) as Props["loan"],
      yearlyInterestRate: toNumber(
        obj.yearlyInterestRate
      ) as Props["yearlyInterestRate"],
      yearlyAppreciationRate: toNumber(
        obj.yearlyAppreciationRate
      ) as Props["yearlyAppreciationRate"],
      monthlyGrossRentalIncome: toInteger(
        obj.monthlyGrossRentalIncome
      ) as Props["monthlyGrossRentalIncome"],
      yearlyRentalIncomeIncrease: toNumber(
        obj.yearlyRentalIncomeIncrease
      ) as Props["yearlyRentalIncomeIncrease"],
      buildingDepreciationRate: toNumber(
        obj.buildingDepreciationRate
      ) as Props["buildingDepreciationRate"],
      purchaseTime: toInteger(obj.purchaseTime) as Props["purchaseTime"],
      description: obj.description as Props["description"],
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
