import * as _ from "lodash";

import State from "./state";
import House from "./house";
import Salary from "./salary";
import Expense from "./expense";
import Stock from "./stock";
import Bank from "./bank";
import Super from "./super";
import Tax from "./tax";
import { uniqueId } from "lodash";

// type Event = (state: State) => State;

enum Action {
  Start,
  Stop,
}

type Item = Bank | Expense | House | Salary | Stock | Super | Tax;

interface Event {
  action: Action;
  item: {
    id: string;
    object: Item;
  };
}

interface Props {
  history: State[];
  events: Event[][];
}

class History {
  history: State[];
  events: Event[][];

  constructor({ history, events }: Props) {
    this.history = history;
    this.events = events;

    if (events.length != history.length) {
      throw RangeError(
        `Events must be specified for every time step in history. 
        Length of events is ${events.length} and history is ${history.length}.`
      );
    }
  }

  getHistory = () => {
    const transformed = Array.from(this.history);

    // TODO: condense into a reduce
    for (let i = 0; i < this.events.length; i++) {
      if (i === 0) {
        transformed[0] = this.applyEvents(this.history[0], this.events[i]);
      } else {
        transformed[i] = this.applyEvents(
          transformed[i - 1].waitOneMonth(),
          this.events[i]
        );
      }
    }

    return transformed;
  };

  getStart = ({ id }: { id: string }) => {
    for (let [time, state] of this.getHistory().entries()) {
      if (
        id in state.getHouses() ||
        id in state.getExpenses() ||
        id in state.getStocks()
      ) {
        return time;
      }
    }

    throw new RangeError("No start found for id " + id);
  };

  getEnd = ({ id }: { id: string }) => {
    const start = this.getStart({ id });

    for (let [time, state] of this.getHistory().entries()) {
      if (
        time > start &&
        !(
          id in state.getHouses() ||
          id in state.getExpenses() ||
          id in state.getStocks()
        )
      ) {
        return time;
      }
    }

    throw new RangeError("No end found for id " + id);
  };

  getType = ({ id }: { id: string }) => {
    for (let state of this.getHistory()) {
      if (id in state.getHouses()) {
        return House;
      }

      if (id in state.getExpenses()) {
        return Expense;
      }

      if (id in state.getStocks()) {
        return Stock;
      }
    }

    return null;
  };

  getItem = ({ time, id }: { time: number; id: string }) => {
    const state = this.getState(time);

    if (id in state.getHouses()) {
      return state.getHouses()[id];
    } else if (id in state.getExpenses()) {
      return state.getExpenses()[id];
    } else if (id in state.getStocks()) {
      return state.getStocks()[id];
    }

    return null;
  };

  getHouses = (): Map<string, House> =>
    this.getHistory().reduce(
      (acc, state) => new Map([...acc, ...Object.entries(state.getHouses())]),
      new Map<string, House>()
    );

  getStocks = (): Map<string, Stock> =>
    this.getHistory().reduce(
      (acc, state) => new Map([...acc, ...Object.entries(state.getStocks())]),
      new Map<string, Stock>()
    );

  getExpenses = (): Map<string, Expense> =>
    this.getHistory().reduce(
      (acc, state) => new Map([...acc, ...Object.entries(state.getExpenses())]),
      new Map<string, Expense>()
    );

  getSalary = (): Salary => this.history[0].getSalary();

  getSuper = (): Super => this.history[0].getSuper();

  getBank = (): Bank => this.history[0].getBank();

  getStock = (): Map<string, Stock> =>
    this.getHistory().reduce(
      (acc, state) => new Map([...acc, ...Object.entries(state.getStocks())]),
      new Map<string, Stock>()
    );

  private applyEvent = ({
    state,
    event,
  }: {
    state: State;
    event: Event;
  }): State => {
    if (event.item.object instanceof Expense) {
      return this.applyExpenseEvent({ state, event });
    } else if (event.item.object instanceof House) {
      return this.applyHouseEvent({ state, event });
    } else if (event.item.object instanceof Stock) {
      return this.applyStockEvent({ state, event });
    } else {
      throw new RangeError("You passed an unrecognised object in an event");
    }
  };

  private applyExpenseEvent = ({
    state,
    event,
  }: {
    state: State;
    event: Event;
  }) => {
    if (event.action === Action.Start) {
      return state.addExpense({
        id: event.item.id,
        expense: event.item.object as Expense,
      });
    }

    return state.removeExpense({ id: event.item.id });
  };

  private applyHouseEvent = ({
    state,
    event,
  }: {
    state: State;
    event: Event;
  }) => {
    if (event.action === Action.Start) {
      return state.buyHouse({
        id: event.item.id,
        house: event.item.object as House,
      });
    }

    return state.sellHouse({ id: event.item.id });
  };

  private applyStockEvent = ({
    state,
    event,
  }: {
    state: State;
    event: Event;
  }) => {
    if (event.action === Action.Start) {
      return state.buyStock({
        id: event.item.id,
        stock: event.item.object as Stock,
      });
    }

    return state.sellStock({ id: event.item.id });
  };

  private applyEvents = (state: State, events: Event[]) => {
    return events.reduce(
      (acc, event) => this.applyEvent({ state: acc, event }),
      state
    );
  };

  getState = (time: number) => {
    return this.getHistory()[time];
  };

  addEvent = ({ time, event }: { time: number; event: Event }) => {
    return new History({
      history: this.history,
      events: this.events.map((evts, t) =>
        t !== time ? evts : evts.concat(event)
      ),
    });
  };

  removeEvent = ({
    time,
    id,
    action,
  }: {
    time: number;
    id: Event["item"]["id"];
    action: Event["action"];
  }) => {
    return new History({
      history: this.history,
      events: this.events.map((evts, t) =>
        t !== time
          ? evts
          : evts.filter((evt) => evt.item.id != id && evt.action === action)
      ),
    });
  };

  setSalary = (salary: Salary) => {
    if (this.history.length === 0) {
      return this;
    }

    if (this.history.length === 1) {
      return new History({
        history: [this.history[0].updateSalary({ data: salary.getProps() })],
        events: this.events,
      });
    }

    const [head, ...tail] = this.history;

    return new History({
      history: [head.updateSalary({ data: salary.getProps() }), ...tail],
      events: this.events,
    });
  };

  setSuper = (superan: Super) => {
    if (this.history.length === 0) {
      return this;
    }

    if (this.history.length === 1) {
      return new History({
        history: [this.history[0].updateSuper({ data: superan.getProps() })],
        events: this.events,
      });
    }

    const [head, ...tail] = this.history;

    return new History({
      history: [head.updateSuper({ data: superan.getProps() }), ...tail],
      events: this.events,
    });
  };

  setBank = (bank: Bank) => {
    if (this.history.length === 0) {
      return this;
    }

    if (this.history.length === 1) {
      return new History({
        history: [this.history[0].updateBank({ data: bank.getProps() })],
        events: this.events,
      });
    }

    const [head, ...tail] = this.history;

    return new History({
      history: [head.updateBank({ data: bank.getProps() }), ...tail],
      events: this.events,
    });
  };
}

export default History;
export { Action };
export type { Props };
