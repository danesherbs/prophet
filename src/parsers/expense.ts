import Expense, { Props } from "../expense";

const parser = (obj: Object): Expense | null => {
  try {
    return new Expense({
      yearlyIncrease: Object(obj).yearlyIncrease as Props["yearlyIncrease"],
      weeklyAmount: Object(obj).weeklyAmount as Props["weeklyAmount"],
      description: Object(obj).description as Props["description"],
      initialTime: Object(obj).initialTime as Props["initialTime"],
    });
  } catch (error) {
    console.log("Couldn't parse", obj);
  }

  return null;
};

export default parser;
