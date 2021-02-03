import Bank, { Props } from "../bank";

const parser = (obj: Object): Bank | null => {
  try {
    return new Bank({
      transactions: Object(obj)["transactions"] as Props["transactions"],
      yearlyInterestRate: Object(obj)
        .yearlyInterestRate as Props["yearlyInterestRate"],
      initialBalance: Object(obj).initialBalance as Props["initialBalance"],
      description: Object(obj).description as Props["description"],
    });
  } catch (error) {
    console.log("Couldn't parse", obj);
  }

  return null;
};

export default parser;
