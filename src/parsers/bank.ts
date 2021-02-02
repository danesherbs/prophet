import Bank, { Props } from "../bank";

const parser = (obj: Props): Bank => {
  try {
    return new Bank({
      transactions: obj.transactions as Props["transactions"],
      yearlyInterestRate: obj.yearlyInterestRate as Props["yearlyInterestRate"],
      initialBalance: obj.initialBalance as Props["initialBalance"],
      description: obj.description as Props["description"],
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
