import Super, { Props } from "../super";
import taxParser from "./tax";

const parser = (obj: Props): Super => {
  try {
    return new Super({
      tax: taxParser(obj.tax) as Props["tax"],
      transactions: obj.transactions as Props["transactions"],
      yearlyInterestRate: obj.yearlyInterestRate as Props["yearlyInterestRate"],
      contributionRate: obj.contributionRate as Props["contributionRate"],
      initialBalance: obj.initialBalance as Props["initialBalance"],
      description: obj.description as Props["description"],
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
