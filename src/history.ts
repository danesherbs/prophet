import * as _ from "lodash";

import State from "./state";
import House from "./house";
import Salary from "./salary";
import Expense from "./expense";

// type Event = (state: State) => State;

enum Action {
  Start,
  Stop,
}

interface Event {
  action: Action;
  item: {
    id: string;
    object: House | Expense | Salary;
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

  getStart = ({ item }: { item: House | Salary }) => {};

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
    } else {
      throw new RangeError("You passed what?!");
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

  private applyEvents = (state: State, events: Event[]) => {
    return events.reduce(
      (acc, event) => this.applyEvent({ state: acc, event }),
      state
    );
  };

  getEvents = () => {
    return this.events;
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
  }: {
    time: number;
    id: Extract<Event, Event["item"]["id"]>;
  }) => {
    return new History({
      history: this.history,
      events: this.events.map((evts, t) =>
        t !== time ? evts : evts.filter((evt) => evt.item.id != id)
      ),
    });
  };
}

export default History;
export { Action };
export type { Props };
