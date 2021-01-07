import * as _ from "lodash";

import State from "./state";
import House from "./house";
import Salary from "./salary";
import Expense from "./expense";

// type Event = (state: State) => State;

interface Event {
  transformation: (state: State) => State;
  name: string;
  id: string;
  type: string;
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

  applyEvents = (state: State, events: Event[]) => {
    return events.reduce((acc, event) => event.transformation(acc), state);
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

  removeEvent = ({ time, event }: { time: number; event: Event }) => {
    return new History({
      history: this.history,
      events: this.events.map((evts, t) =>
        t !== time
          ? evts
          : evts.filter(
              (evt) =>
                evt.name != event.name &&
                evt.id != event.id &&
                evt.type != event.type
            )
      ),
    });
  };

  dropEventsAfter = ({ time, id }: { time: number; id: string }) => {
    return new History({
      history: this.history,
      events: this.events.map((evts, t) =>
        t > time ? evts : evts.filter((evt) => evt.id != id)
      ),
    });
  };
}

export default History;
export type { Props };
