import { toArray, toNumber } from "lodash";
import Super, { Props } from "../super";
import taxParser from "./tax";

const parser = (obj: Props): Super => {
  try {
    return new Super({
      tax: taxParser(obj.tax) as Props["tax"],
      transactions: toArray(obj.transactions) as Props["transactions"],
      yearlyInterestRate: toNumber(
        obj.yearlyInterestRate
      ) as Props["yearlyInterestRate"],
      contributionRate: toNumber(
        obj.contributionRate
      ) as Props["contributionRate"],
      initialBalance: toNumber(obj.initialBalance) as Props["initialBalance"],
      description: obj.description as Props["description"],
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
