import State from "./state";
import House, { Props as HouseProps } from "./house";
import Salary, { Props as SalaryProps } from "./salary";
import Expense, { Props as ExpenseProps } from "./expense";
import Stock, { Props as StockProps } from "./stock";
import Bank, { Props as BankProps } from "./bank";
import Super, { Props as SuperProps } from "./super";
import Tax, { Props as TaxProps } from "./tax";
import Clock from "./clock";
import Event, { Action, ends as endActions } from "./event";

interface Events {
  [time: number]: Array<Event>;
}

interface Props {
  events: Events;
}

class History {
  events: Map<number, Set<Event>>;

  constructor({ events }: Props) {
    this.events = new Map(
      [...Object.entries(events)].map(([id, evts]) => [
        parseInt(id),
        new Set(evts),
      ])
    );
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

        //   new Map(
        //   [...this.events].filter(
        //     ([time]) => time !== this.toDateTime({ date })
        //   )
        // ),
      });
    }

    return new History({
      events: {
        ...Object.fromEntries(this.events.entries()),
        [this.toDateTime({ date })]: newEvents,
      },
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

    return this.removeEvent({
      date: start,
      id,
    }).addEvent({
      date,
      event,
    });
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

    return this.removeEvent({ date: end, id }).addEvent({ date, event });
  };

  setAction = ({ id, action }: { id: string; action: Action }) => {
    const start = this.getStart({ id });
    const event = this.getEvent({ date: start, id });

    return this.removeEvent({ date: start, id }).addEvent({
      date: start,
      event: {
        action,
        item: { id, object: event.item.object },
      },
    });
  };

  getHouses = (): State["houses"] =>
    this.getStates().reduce(
      (acc, state) => new Map([...state.getHouses().entries(), ...acc]),
      new Map<string, House>()
    );

  getStocks = (): State["stocks"] =>
    this.getStates().reduce(
      (acc, state) => new Map([...state.getStocks().entries(), ...acc]),
      new Map<string, Stock>()
    );

  getExpenses = (): State["expenses"] =>
    this.getStates().reduce(
      (acc, state) => new Map([...state.getExpenses().entries(), ...acc]),
      new Map<string, Expense>()
    );

  getSalaries = (): State["salaries"] =>
    this.getStates().reduce(
      (acc, state) => new Map([...state.getSalaries().entries(), ...acc]),
      new Map<string, Salary>()
    );

  getSupers = (): State["superans"] =>
    this.getStates().reduce(
      (acc, state) => new Map([...state.getSupers().entries(), ...acc]),
      new Map<string, Super>()
    );

  getBanks = (): State["banks"] =>
    this.getStates().reduce(
      (acc, state) => new Map([...state.getBanks().entries(), ...acc]),
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
    const horizon = 60;

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
                  loans: new Map(),
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

      default: {
        throw new Error(`Action ${event.action} is not registered.`);
      }
    }
  };
}

export default History;
export type { Props };
export { Action, Event };
