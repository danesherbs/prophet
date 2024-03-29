import History, { Props as HistoryProps } from "./history";

interface Histories {
  [id: string]: HistoryProps;
}

interface Props {
  histories: Histories;
}

class Scenarios {
  histories: Histories;

  constructor({ histories }: Props) {
    this.histories = histories;
  }

  getProps = (): Props => {
    return { histories: this.histories };
  };

  getIds = () => {
    return [...Object.keys(this.histories)];
  };

  toString = () => {
    return JSON.stringify(this.histories);
  };

  static fromJSON = (data: Props["histories"]) => {
    try {
      return new Scenarios({ histories: data });
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  getHistory = ({ id }: { id: string }) => {
    if (id in this.histories) {
      return new History(this.histories[id]);
    }

    throw new Error(
      `Tried to retrieve history ${id} but didn't exist in list of ids ${this.getIds()}`
    );
  };

  addHistory = ({ id, history }: { id: string; history: History }) => {
    return new Scenarios({
      histories: { ...this.histories, [id]: history.getProps() },
    });
  };

  removeHistory = ({ id }: { id: string }) => {
    return new Scenarios({
      histories: Object.fromEntries(
        [...Object.entries(this.histories)].filter(([i]) => i !== id)
      ),
    });
  };
}

export default Scenarios;
export type { Props };
