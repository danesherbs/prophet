import House from "./house";
import Salary from "./salary";
import Expense from "./expense";
import Stock from "./stock";
import Bank from "./bank";
import Super from "./super";
import Tax from "./tax";

enum Action {
  // Bank
  AddTax,
  // Bank
  AddBank,

  // Super
  AddSuper,

  // Salaries
  AddSalary,
  RemoveSalary,

  // Expenses
  AddExpense,
  RemoveExpense,

  // Houses
  AddHouse,
  BuyHouse,
  SellHouse,

  // Stocks
  AddStock,
  BuyStock,
  SellStock,
}

const ends = new Set([
  Action.RemoveSalary,
  Action.RemoveExpense,
  Action.SellHouse,
  Action.SellStock,
]);

type Item = Bank | Expense | House | Salary | Stock | Super | Tax;

interface Props {
  action: Action;
  item: {
    id: string;
    object: Item;
  };
}

class Event {
  action: Action;
  item: {
    id: string;
    object: Item;
  };

  constructor({ action, item }: Props) {
    this.action = action;
    this.item = item;
  }
}

export default Event;
export { Action, ends };
