import Super, { Props } from "../super";
import taxParser from "./tax";

const parser = (obj: Object): Super | null => {
  try {
    return new Super({
      tax: taxParser(Object(obj).tax) as Props["tax"],
      transactions: Object(obj).transactions as Props["transactions"],
      yearlyInterestRate: Object(obj)
        .yearlyInterestRate as Props["yearlyInterestRate"],
      contributionRate: Object(obj)
        .contributionRate as Props["contributionRate"],
      initialBalance: Object(obj).initialBalance as Props["initialBalance"],
      description: Object(obj).description as Props["description"],
    });
  } catch (error) {
    console.log("Couldn't parse", obj);
  }

  return null;
};

export default parser;
