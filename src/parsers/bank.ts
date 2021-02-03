import Bank, { Props } from "../bank";
import { getValueSafely } from "./utils";

const parser = (obj: Object): Bank | null => {
  try {
    const mapping = new Map(Object.entries(obj));

    return new Bank({
      transactions: getValueSafely(
        mapping,
        "transactions"
      ) as Props["transactions"],
      yearlyInterestRate: getValueSafely(
        mapping,
        "yearlyInterestRate"
      ) as Props["yearlyInterestRate"],
      initialBalance: mapping.get("initialBalance") as Props["initialBalance"],
      description: mapping.get("description") as Props["description"],
    });
  } catch (error) {
    console.log("Couldn't parse", obj);
  }

  return null;
};

export default parser;
