import { Props as HouseProps } from "./house";
import { Props as SalaryProps } from "./salary";
import { Props as ExpenseProps } from "./expense";
import { Props as StockProps } from "./stock";
import { Props as BankProps } from "./bank";
import { Props as SuperProps } from "./super";
import { Props as TaxProps } from "./tax";
import { Props as LoanProps } from "./loan";

enum Action {
  // Tax
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

  // Loans
  AddLoan,
  RemoveLoan,
}

const ends = new Set([
  Action.RemoveSalary,
  Action.RemoveExpense,
  Action.SellHouse,
  Action.SellStock,
]);

type ItemProps =
  | BankProps
  | ExpenseProps
  | HouseProps
  | SalaryProps
  | StockProps
  | SuperProps
  | TaxProps
  | LoanProps;

interface Props {
  action: Action;
  item: {
    id: string;
    object: ItemProps;
  };
}

class Event {
  action: Action;
  item: {
    id: string;
    object: ItemProps;
  };

  constructor({ action, item }: Props) {
    this.action = action;
    this.item = item;
  }
}

export default Event;
export type { Props };
export { Action, ItemProps, ends };
