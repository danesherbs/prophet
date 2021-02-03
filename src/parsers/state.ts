import State, { Props, Collection } from "../state";
import House from "../house";
import Stock from "../stock";
import Expense from "../expense";

import clockParser from "./clock";
import taxParser from "./tax";
import bankParser from "./bank";
import superParser from "./super";
import salaryParser from "./salary";
import houseParser from "./house";
import stockParser from "./stock";
import expenseParser from "./expense";

const parser = (obj: Object): State | null => {
  try {
    return new State({
      clock: clockParser(Object(obj).clock) as Props["clock"],
      tax: taxParser(Object(obj).tax) as Props["tax"],
      bank: bankParser(Object(obj).bank) as Props["bank"],
      superan: superParser(Object(obj).superan) as Props["superan"],
      salary: salaryParser(Object(obj).salary) as Props["salary"],
      houses: Object.fromEntries(
        Object.entries(Object(obj).houses).map(([key, value]) => [
          key,
          houseParser(value as Object) as House,
        ])
      ) as Collection<House>,
      stocks: Object.fromEntries(
        Object.entries(Object(obj).stocks).map(([key, value]) => [
          key,
          stockParser(value as Object) as Stock,
        ])
      ) as Collection<Stock>,
      expenses: Object.fromEntries(
        Object.entries(Object(obj).expenses).map(([key, value]) => [
          key,
          expenseParser(value as Object) as Expense,
        ])
      ) as Collection<Expense>,
    });
  } catch (error) {
    console.log("Couldn't parse", obj);
  }

  return null;
};

export default parser;
