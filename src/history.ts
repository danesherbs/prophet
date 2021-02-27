import * as _ from "lodash";

import State from "./state";
import House from "./house";
import Salary from "./salary";
import Expense from "./expense";
import Stock from "./stock";
import Bank from "./bank";
import Super from "./super";
import Tax from "./tax";
import Clock from "./clock";
import Event, { Action, ends as endActions } from "./event";

// enum Action {
//   // Bank
//   AddTax,
//   // Bank
//   AddBank,

//   // Super
//   AddSuper,

//   // Salaries
//   AddSalary,
//   RemoveSalary,

//   // Expenses
//   AddExpense,
//   RemoveExpense,

//   // Houses
//   AddHouse,
//   BuyHouse,
//   SellHouse,

//   // Stocks
//   AddStock,
//   BuyStock,
//   SellStock,
// }

// const endActions = new Set([
//   Action.RemoveSalary,
//   Action.RemoveExpense,
//   Action.SellHouse,
//   Action.SellStock,
// ]);

// type Item = Bank | Expense | House | Salary | Stock | Super | Tax;

// interface Event {
//   action: Action;
//   item: {
//     id: string;
//     object: Item;
//   };
// }

interface Props {
  events?: Map<number, Set<Event>>;
}

class History {
  events: Map<number, Set<Event>>;

  constructor({ events }: Props) {
    this.events = events !== undefined ? events : new Map<number, Set<Event>>();
  }

  getEvents = () => {
    return this.events;
  };

  toDateTime = ({ date }: { date: Date }) =>
    new Date(date.getFullYear(), date.getMonth()).getTime();

  fromDateTime = ({ dateTime }: { dateTime: number }) => new Date(dateTime);

  addEvent = ({ date, event }: { date: Date; event: Event }) => {
    const events = this.events.get(this.toDateTime({ date }));

    return new History({
      events: new Map(this.events).set(
        this.toDateTime({ date }),
        events !== undefined ? new Set([...events, event]) : new Set([event])
      ),
    });
  };

  removeEvent = ({ date, id }: { date: Date; id: string }) => {
    const events = this.events.get(this.toDateTime({ date }));

    return new History({
      events: new Map(this.events).set(
        this.toDateTime({ date }),
        events !== undefined
          ? new Set([...events].filter((event) => event.item.id !== id))
          : new Set([])
      ),
    });
  };

  getStart = ({ id }: { id: string }) => {
    for (let [time, events] of this.events) {
      for (let event of events) {
        if (event.item.id === id) {
          return this.fromDateTime({ dateTime: time });
        }
      }
    }

    throw new RangeError(
      "Tried to retrieve start for id " + id + " which doesn't exist."
    );
  };

  setStart = ({ date, id }: { date: Date; id: string }) => {
    const start = this.getStart({ id });
    const event = this.getEvent({ date: start, id });

    if (event === null) {
      throw new Error(`Tried to set start of non-existent event for id ${id}`);
    }

    return this.removeEvent({
      date: start,
      id,
    }).addEvent({
      date,
      event,
    });
  };

  getEvent = ({ date, id }: { date: Date; id: string }) => {
    const events = this.events.get(this.toDateTime({ date }));

    if (events !== undefined) {
      for (let event of events) {
        if (event.item.id === id) {
          return event;
        }
      }
    }

    return null;
  };

  getEnd = ({ id }: { id: string }) => {
    for (let [time, events] of this.events) {
      for (let event of events) {
        if (endActions.has(event.action)) {
          return this.fromDateTime({ dateTime: time });
        }
      }
    }

    return null;
  };

  setEnd = ({ date, id }: { date: Date; id: string }) => {
    const end = this.getEnd({ id });

    if (end === null) {
      throw new Error(
        `Tried to reset end for id ${id} but end hasn't been set.`
      );
    }

    const event = this.getEvent({
      date: end,
      id,
    });

    if (event === null) {
      throw new Error(`Tried to set end of non-existent event for id ${id}`);
    }

    return this.removeEvent({ date: end, id }).addEvent({ date, event });
  };

  getHouses = (): State["houses"] =>
    this.getStates().reduce(
      (acc, state) => new Map([...acc, ...state.getHouses().entries()]),
      new Map<string, House>()
    );

  getStocks = (): State["stocks"] =>
    this.getStates().reduce(
      (acc, state) => new Map([...acc, ...state.getStocks().entries()]),
      new Map<string, Stock>()
    );

  getExpenses = (): State["expenses"] =>
    this.getStates().reduce(
      (acc, state) => new Map([...acc, ...state.getExpenses().entries()]),
      new Map<string, Expense>()
    );

  getSalaries = (): State["salaries"] =>
    this.getStates().reduce(
      (acc, state) => new Map([...acc, ...state.getSalaries().entries()]),
      new Map<string, Salary>()
    );

  getSupers = (): State["superans"] =>
    this.getStates().reduce(
      (acc, state) => new Map([...acc, ...state.getSupers().entries()]),
      new Map<string, Super>()
    );

  getBanks = (): State["banks"] =>
    this.getStates().reduce(
      (acc, state) => new Map([...acc, ...state.getBanks().entries()]),
      new Map<string, Bank>()
    );

  private monthsBetween = ({ start, end }: { start: Date; end: Date }) => {
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    return years * 12 + months + 1; // includes both start and end
  };

  getStates = () => {
    const actions = [...this.events].reduce(
      (acc, [, events]) =>
        new Set([...acc, ...[...events].map((event) => event.action)]),
      new Set<Action>([])
    );

    if (
      !(
        actions.has(Action.AddBank) &&
        actions.has(Action.AddSalary) &&
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
    const horizon = 120;

    const states: Array<State> = [];

    for (let i = 0; i < elapsed + horizon; i++) {
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
                })
              : states[i - 1].waitOneMonth(),
          events: events !== undefined ? events : new Set(),
        })
      );
    }

    return states;
  };

  getState = (time: number) => {
    return this.getStates()[time];
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
          tax: event.item.object as Tax,
        });
      }

      case Action.AddBank: {
        return state.addBank({
          id: event.item.id,
          bank: event.item.object as Bank,
        });
      }

      case Action.AddSuper: {
        return state.addSuper({
          id: event.item.id,
          superan: event.item.object as Super,
        });
      }

      case Action.AddSalary: {
        return state.addSalary({
          id: event.item.id,
          salary: event.item.object as Salary,
        });
      }

      case Action.RemoveSalary: {
        return state.removeSalary({ id: event.item.id });
      }

      case Action.AddExpense: {
        return state.addExpense({
          id: event.item.id,
          expense: event.item.object as Expense,
        });
      }

      case Action.RemoveExpense: {
        return state.removeExpense({ id: event.item.id });
      }

      case Action.AddHouse: {
        return state.addHouse({
          id: event.item.id,
          house: event.item.object as House,
        });
      }

      case Action.BuyHouse: {
        return state.buyHouse({
          id: event.item.id,
          house: event.item.object as House,
        });
      }

      case Action.SellHouse: {
        return state.sellHouse({ id: event.item.id });
      }

      case Action.AddStock: {
        return state.addStock({
          id: event.item.id,
          stock: event.item.object as Stock,
        });
      }

      case Action.BuyStock: {
        return state.buyStock({
          id: event.item.id,
          stock: event.item.object as Stock,
        });
      }

      case Action.SellStock: {
        return state.sellStock({ id: event.item.id });
      }

      default: {
        throw new Error(`Action ${event.action} is not registered.`);
      }
    }
  };
}

export default History;
export type { Props };
export { Action, Event };
