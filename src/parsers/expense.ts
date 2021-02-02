import Expense, { Props } from "../expense";
import { toNumber } from "lodash";

const parser = (obj: Props): Expense => {
  try {
    return new Expense({
      yearlyIncrease: toNumber(obj.yearlyIncrease) as Props["yearlyIncrease"],
      weeklyAmount: toNumber(obj.weeklyAmount) as Props["weeklyAmount"],
      description: obj.description as Props["description"],
      initialTime: toNumber(obj.initialTime) as Props["initialTime"],
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
