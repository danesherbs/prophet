import { toArray, toNumber } from "lodash";
import Bank, { Props } from "../bank";

const parser = (obj: Props): Bank => {
  try {
    return new Bank({
      transactions: toArray(obj.transactions) as Props["transactions"],
      yearlyInterestRate: toNumber(
        obj.yearlyInterestRate
      ) as Props["yearlyInterestRate"],
      initialBalance: toNumber(obj.initialBalance) as Props["initialBalance"],
      description: obj.description as Props["description"],
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
