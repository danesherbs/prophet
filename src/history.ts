import State from "./state";
import House, { Props as HouseProps } from "./house";
import Salary, { Props as SalaryProps } from "./salary";
import Expense, { Props as ExpenseProps } from "./expense";
import Stock, { Props as StockProps } from "./stock";
import Loan, { Props as LoanProps } from "./loan";
import Bank, { Props as BankProps } from "./bank";
import Super, { Props as SuperProps } from "./super";
import Tax, { Props as TaxProps } from "./tax";
import Clock from "./clock";
import Event, { Action, endActions, startActions, addActions } from "./event";
import { v4 as uuidv4 } from "uuid";

interface Events {
  [time: number]: Event[];
}

interface Props {
  events: Events;
}

class History {
  events: Map<number, Set<Event>>;
  memo: Map<number, State[]>;

  constructor({ events }: Props) {
    this.events = new Map(
      [...Object.entries(events)].map(([time, evts]) => [
        parseInt(time),
        new Set(evts),
      ])
    );

    this.memo = new Map<number, State[]>(); // cache for getStates
  }

  getEvents = () => {
    return this.events;
  };

  getProps = (): Props => {
    return {
      events: Object.fromEntries(
        [...this.events.entries()].map(([id, events]) => [id, [...events]])
      ),
    };
  };

  toString = () => {
    return JSON.stringify(
      [...this.events.entries()].map(([time, evts]) => [
        this.fromDateTime({ dateTime: time }),
        [...evts],
      ])
    );
  };

  static fromJSON = (data: [[string, [Event]]]) => {
    try {
      return data.reduce(
        (acc: History, [date, events]) =>
          events.reduce(
            (hst, event) => hst.addEvent({ date: new Date(date), event }),
            acc
          ),
        new History({ events: {} })
      );
    } catch {
      return null;
    }
  };

  isValid = () => {
    /*
    Checks if events are valid i.e. this DAG shorturl.at/fhyT6 can be topollogically sorted.
    */

    // Call isValidDAG

    // Call isValidEvents, which checks:
    //      - Valid start and ends for each id
    //      - Valid actions event.item.object types e.g. AddHouse w/ house.isAlreadyOwned = False is invalid

    throw new Error("Not implemented!");
  };

  toDateTime = ({ date }: { date: Date }) =>
    new Date(date.getFullYear(), date.getMonth()).getTime();

  fromDateTime = ({ dateTime }: { dateTime: number }) => new Date(dateTime);

  getEvent = ({ date, id }: { date: Date; id: string }) => {
    const events = this.events.get(this.toDateTime({ date }));

    if (events !== undefined) {
      for (let event of events) {
        if (event.item.id === id) {
          return event;
        }
      }
    }

    throw new RangeError(
      "Tried to retrieve event for id " + id + " but doesn't exist."
    );
  };

  addEvent = ({ date, event }: { date: Date; event: Event }) => {
    const events = this.events.get(this.toDateTime({ date }));

    return new History({
      events: {
        ...Object.fromEntries(this.events.entries()),
        [this.toDateTime({ date })]:
          events !== undefined ? new Set([...events, event]) : new Set([event]),
      },
    });
  };

  removeEvent = ({ date, id }: { date: Date; id: string }) => {
    const events = this.events.get(this.toDateTime({ date }));

    if (events === undefined) {
      return this;
    }

    const newEvents = new Set(
      [...events].filter((event) => event.item.id !== id)
    );

    if (newEvents.size === 0) {
      return new History({
        events: Object.fromEntries(
          [...this.events.entries()]
            .filter(([time]) => time !== this.toDateTime({ date }))
            .map(([id, events]) => [id, [...events]])
        ),
      });
    }

    return new History({
      events: {
        ...Object.fromEntries(this.events.entries()),
        [this.toDateTime({ date })]: newEvents,
      },
    });
  };

  getIds = (): string[] =>
    [...this.events].reduce(
      (acc: string[], [time, events]) => [
        ...acc,
        ...[...events].map((event) => event.item.id),
      ],
      []
    );

  removeId = ({ id }: { id: string }) => {
    const newEvents = Object.fromEntries(
      [...this.events].map(([time, evts]) => [
        time,
        [...evts].filter((evt) => evt.item.id !== id),
      ])
    );

    // Remove any empty time periods
    for (const [time, evts] of Object.entries(newEvents)) {
      if (evts.length === 0) {
        delete newEvents[time];
      }
    }

    return new History({ events: newEvents });
  };

  getStart = ({ id }: { id: string }) => {
    for (let [time, events] of this.events) {
      for (let event of events) {
        if (event.item.id === id && startActions.has(event.action)) {
          return this.fromDateTime({ dateTime: time });
        }
      }
    }

    return null;
  };

  setStart = ({
    id,
    date,
    startEvent,
  }: {
    id: string;
    date: Date | null;
    startEvent?: Event;
  }) => {
    const start = this.getStart({ id });

    if (start === null && date !== null && startEvent === undefined) {
      throw new Error(`Called setStart on ${id} but didn't give initial event`);
    }

    if (start === null && date === null) {
      return this; // nothing to do
    } else if (start !== null && date === null) {
      return this.removeEvent({ date: start, id });
    } else if (start === null && date !== null && startEvent !== undefined) {
      return this.addEvent({ date, event: startEvent });
    } else if (start !== null && date !== null && startEvent !== undefined) {
      const event = this.getEvent({ date: start, id });
      return this.removeEvent({ date: start, id }).addEvent({
        date,
        event: startEvent,
      });
    } else if (start !== null && date !== null && startEvent === undefined) {
      const event = this.getEvent({ date: start, id });
      return this.removeEvent({ date: start, id }).addEvent({ date, event });
    }

    return this; // should never happen -- throw error instead?
  };

  getEnd = ({ id }: { id: string }) => {
    for (let [time, events] of this.events) {
      for (let event of events) {
        if (event.item.id === id && endActions.has(event.action)) {
          return this.fromDateTime({ dateTime: time });
        }
      }
    }

    return null;
  };

  setEnd = ({
    id,
    date,
    endEvent,
  }: {
    id: string;
    date: Date | null;
    endEvent?: Event;
  }) => {
    const end = this.getEnd({ id });

    if (end === null && date !== null && endEvent === undefined) {
      throw new Error(`Called setEnd on ${id} but didn't give end event`);
    }

    if (end === null && date === null) {
      return this; // nothing to do
    } else if (end !== null && date === null) {
      return this.removeEvent({ date: end, id });
    } else if (end === null && date !== null && endEvent !== undefined) {
      return this.addEvent({ date, event: endEvent });
    } else if (end !== null && date !== null) {
      const event = this.getEvent({ date: end, id });
      return this.removeEvent({ date: end, id }).addEvent({ date, event });
    }

    return this; // should never happen -- throw error instead?
  };

  getHouses = (): State["houses"] =>
    [...this.events].reduce((acc, [time, events]) => {
      const houses: [string, House][] = [...events]
        .filter(
          (evt) =>
            evt.action === Action.AddHouse || evt.action === Action.BuyHouse
        )
        .map((evt) => [evt.item.id, new House(evt.item.object as HouseProps)]);

      return new Map([...acc, ...houses]);
    }, new Map<string, House>());

  getStocks = (): State["stocks"] =>
    [...this.events].reduce((acc, [time, events]) => {
      const stocks: [string, Stock][] = [...events]
        .filter(
          (evt) =>
            evt.action === Action.AddStock || evt.action === Action.BuyStock
        )
        .map((evt) => [evt.item.id, new Stock(evt.item.object as StockProps)]);

      return new Map([...acc, ...stocks]);
    }, new Map<string, Stock>());

  getLoans = (): State["loans"] =>
    [...this.events].reduce((acc, [time, events]) => {
      const stocks: [string, Loan][] = [...events]
        .filter((evt) => evt.action === Action.AddLoan)
        .map((evt) => [evt.item.id, new Loan(evt.item.object as LoanProps)]);

      return new Map([...acc, ...stocks]);
    }, new Map<string, Loan>());

  getExpenses = (): State["expenses"] =>
    [...this.events].reduce((acc, [time, events]) => {
      const expenses: [string, Expense][] = [...events]
        .filter((evt) => evt.action === Action.AddExpense)
        .map((evt) => [
          evt.item.id,
          new Expense(evt.item.object as ExpenseProps),
        ]);

      return new Map([...acc, ...expenses]);
    }, new Map<string, Expense>());

  getSalaries = (): State["salaries"] =>
    [...this.events].reduce((acc, [time, events]) => {
      const salaries: [string, Salary][] = [...events]
        .filter((evt) => evt.action === Action.AddSalary)
        .map((evt) => [
          evt.item.id,
          new Salary(evt.item.object as SalaryProps),
        ]);

      return new Map([...acc, ...salaries]);
    }, new Map<string, Salary>());

  getSupers = (): State["superans"] =>
    [...this.events].reduce((acc, [time, events]) => {
      const supers: [string, Super][] = [...events]
        .filter((evt) => evt.action === Action.AddSuper)
        .map((evt) => [evt.item.id, new Super(evt.item.object as SuperProps)]);

      return new Map([...acc, ...supers]);
    }, new Map<string, Super>());

  getBanks = (): State["banks"] =>
    [...this.events].reduce((acc, [time, events]) => {
      const banks: [string, Bank][] = [...events]
        .filter((evt) => evt.action === Action.AddBank)
        .map((evt) => [evt.item.id, new Bank(evt.item.object as BankProps)]);

      return new Map([...acc, ...banks]);
    }, new Map<string, Bank>());

  getTaxes = (): State["tax"] =>
    [...this.events].reduce((acc, [time, events]) => {
      const txs: [string, Tax][] = [...events]
        .filter((evt) => evt.action === Action.AddTax)
        .map((evt) => [evt.item.id, new Tax(evt.item.object as TaxProps)]);

      return new Map([...acc, ...txs]);
    }, new Map<string, Tax>());

  private monthsBetween = ({ start, end }: { start: Date; end: Date }) => {
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    return years * 12 + months + 1; // includes both start and end
  };

  getStates = ({ horizonInMonths }: { horizonInMonths: number }) => {
    if (horizonInMonths <= 0) {
      throw new Error(
        `Horizon is expected to be natural number but got ${horizonInMonths}`
      );
    }

    if (this.memo.has(horizonInMonths)) {
      return this.memo.get(horizonInMonths) as State[];
    }

    const actions = [...this.events].reduce(
      (acc, [, events]) =>
        new Set([...acc, ...[...events].map((event) => event.action)]),
      new Set<Action>()
    );

    if (
      !(
        actions.has(Action.AddBank) &&
        actions.has(Action.AddTax) &&
        actions.has(Action.AddSuper)
      )
    ) {
      throw new Error(
        `Expected actions to include additions of tax, bank, super and salary but got actions [${[
          ...actions,
        ]}]`
      );
    }

    const dates = [...this.events.keys()];

    if (dates.length === 0) {
      return [];
    }

    const start = dates.reduce((acc, cur) => (acc < cur ? acc : cur));
    const end = dates.reduce((acc, cur) => (acc > cur ? acc : cur));
    const elapsed = this.monthsBetween({
      start: this.fromDateTime({ dateTime: start }),
      end: this.fromDateTime({ dateTime: end }),
    });

    const states: Array<State> = [];

    for (let i = 0; i < elapsed + horizonInMonths; i++) {
      const date = this.toDateTime({
        date: new Date(
          new Date(start).getFullYear() + Math.floor(i / 12),
          new Date(start).getMonth() + (i % 12)
        ),
      });

      const events = this.events.get(date);

      states.push(
        this.applyEvents({
          state:
            i === 0
              ? new State({
                  clock: new Clock(0),
                  tax: new Map(),
                  banks: new Map(),
                  superans: new Map(),
                  salaries: new Map(),
                  houses: new Map(),
                  stocks: new Map(),
                  expenses: new Map(),
                  loans: new Map(),
                })
              : states[i - 1].waitOneMonth(),
          events: events !== undefined ? events : new Set(),
        })
      );
    }

    this.memo.set(horizonInMonths, states);

    return states;
  };

  getState = (time: number) => {
    return this.getStates({ horizonInMonths: 120 })[time];
  };

  applyEvents = ({ state, events }: { state: State; events: Set<Event> }) => {
    return Array.from(events).reduce(
      (acc, event) => this.applyEvent({ state: acc, event }),
      state
    );
  };

  applyEvent = ({ state, event }: { state: State; event: Event }): State => {
    switch (event.action) {
      case Action.AddTax: {
        return state.addTax({
          id: event.item.id,
          tax: new Tax(event.item.object as TaxProps),
        });
      }

      case Action.AddBank: {
        return state.addBank({
          id: event.item.id,
          bank: new Bank(event.item.object as BankProps),
        });
      }

      case Action.AddSuper: {
        return state.addSuper({
          id: event.item.id,
          superan: new Super(event.item.object as SuperProps),
        });
      }

      case Action.AddSalary: {
        return state.addSalary({
          id: event.item.id,
          salary: new Salary(event.item.object as SalaryProps),
        });
      }

      case Action.RemoveSalary: {
        return state.removeSalary({ id: event.item.id });
      }

      case Action.AddExpense: {
        return state.addExpense({
          id: event.item.id,
          expense: new Expense(event.item.object as ExpenseProps),
        });
      }

      case Action.RemoveExpense: {
        return state.removeExpense({ id: event.item.id });
      }

      case Action.AddHouse: {
        return state.addHouse({
          id: event.item.id,
          house: new House(event.item.object as HouseProps),
        });
      }

      case Action.BuyHouse: {
        return state.buyHouse({
          id: event.item.id,
          house: new House(event.item.object as HouseProps),
        });
      }

      case Action.SellHouse: {
        return state.sellHouse({ id: event.item.id });
      }

      case Action.AddStock: {
        return state.addStock({
          id: event.item.id,
          stock: new Stock(event.item.object as StockProps),
        });
      }

      case Action.BuyStock: {
        return state.buyStock({
          id: event.item.id,
          stock: new Stock(event.item.object as StockProps),
        });
      }

      case Action.SellStock: {
        return state.sellStock({ id: event.item.id });
      }

      case Action.AddLoan: {
        return state.addLoan({
          id: event.item.id,
          loan: new Loan(event.item.object as LoanProps),
        });
      }

      case Action.RemoveLoan: {
        return state.removeLoan({
          id: event.item.id,
        });
      }

      default: {
        throw new Error(`Action ${event.action} is not recognised.`);
      }
    }
  };

  hasValidDependencyGraph = (): boolean => {
    const actions = [...this.events].reduce(
      (acc, [, events]) =>
        new Set([...acc, ...[...events].map((event) => event.action)]),
      new Set<Action>()
    );

    if (
      !actions.has(Action.AddBank) ||
      !actions.has(Action.AddTax) ||
      !actions.has(Action.AddSuper)
    ) {
      return false;
    }

    const [bankId] = [...this.getBanks().keys()];
    const [taxId] = [...this.getTaxes().keys()];
    const [superId] = [...this.getSupers().keys()];

    const bankStart = this.getStart({ id: bankId });
    const taxStart = this.getStart({ id: taxId });
    const superStart = this.getStart({ id: superId });

    // Check wether bank, tax and super exist
    if (bankStart === null || taxStart === null || superStart === null) {
      return false;
    }

    // Check super comes after bank and tax
    if (!(bankStart <= superStart && taxStart <= superStart)) {
      return false;
    }

    // Check houses come after bank and tax
    for (const [id] of this.getHouses()) {
      const houseStart = this.getStart({ id });

      if (
        !(
          houseStart !== null &&
          bankStart <= houseStart &&
          taxStart <= houseStart
        )
      ) {
        return false;
      }
    }

    // Check stocks come after bank and tax
    for (const [id] of this.getStocks()) {
      const stockStart = this.getStart({ id });

      if (
        !(
          stockStart !== null &&
          bankStart <= stockStart &&
          taxStart <= stockStart
        )
      ) {
        return false;
      }
    }

    // Check expenses come after bank and tax
    for (const [id] of this.getExpenses()) {
      const expenseStart = this.getStart({ id });

      if (
        !(
          expenseStart !== null &&
          bankStart <= expenseStart &&
          taxStart <= expenseStart
        )
      ) {
        return false;
      }
    }

    // Check salary comes after bank, super and tax
    for (const [id] of this.getSalaries()) {
      const salaryStart = this.getStart({ id });

      if (
        !(
          salaryStart !== null &&
          bankStart <= salaryStart &&
          taxStart <= salaryStart &&
          superStart <= salaryStart
        )
      ) {
        return false;
      }
    }

    return true;
  };

  generateId = () => `${new Date().getTime()}-${uuidv4()}`;

  clone = (): History => {
    const newIds = new Map<string, string>(
      this.getIds().map((id) => [id, this.generateId()])
    ); // create mapping from old ids to new ids

    return new History({
      events: Object.fromEntries(
        [...this.events].map(([time, events]) => [
          time,
          [...events].map((event) => {
            return {
              action: event.action,
              item: {
                id: newIds.get(event.item.id) as string,
                object: event.item.object,
              },
            };
          }),
        ])
      ),
    });
  };

  isAlreadyOwned = ({ id }: { id: string }) => {
    const start = this.getStart({ id });

    if (start !== null) {
      const event = this.getEvent({ date: start, id });
      return addActions.has(event.action);
    }

    return false;
  };
}

export default History;
export type { Props };
export { Action, Event };
