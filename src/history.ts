import State from "./state";

type Event = (state: State) => State;

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
        `Events must be specified for every time step in history. Length of events is ${events.length} and history is ${history.length}.`
      );
    }
  }

  getHistory() {
    return this.history.map((state, t, arr) =>
      this.events[t].reduce(
        (prev, event) => event(prev),
        t === 0 ? state : arr[t - 1]
      )
    );
  }

  getEvents() {
    return this.events;
  }

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
}

export default History;
export type { Props };
