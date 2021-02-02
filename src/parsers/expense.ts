import Expense, { Props } from "../expense";

const parser = (obj: Props): Expense => {
  try {
    return new Expense({
      yearlyIncrease: obj.yearlyIncrease as Props["yearlyIncrease"],
      weeklyAmount: obj.weeklyAmount as Props["weeklyAmount"],
      description: obj.description as Props["description"],
      initialTime: obj.initialTime as Props["initialTime"],
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
