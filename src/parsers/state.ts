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

const parser = (obj: Props): State => {
  try {
    return new State({
      clock: clockParser(obj.clock) as Props["clock"],
      tax: taxParser(obj.tax) as Props["tax"],
      bank: bankParser(obj.bank) as Props["bank"],
      superan: superParser(obj.superan) as Props["superan"],
      salary: salaryParser(obj.salary) as Props["salary"],
      houses: Object.fromEntries(
        Object.entries(obj.houses).map(([key, value]) => [
          key,
          houseParser(value) as House,
        ])
      ) as Collection<House>,
      stocks: Object.fromEntries(
        Object.entries(obj.stocks).map(([key, value]) => [
          key,
          stockParser(value) as Stock,
        ])
      ) as Collection<Stock>,
      expenses: Object.fromEntries(
        Object.entries(obj.expenses).map(([key, value]) => [
          key,
          expenseParser(value) as Expense,
        ])
      ) as Collection<Expense>,
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
