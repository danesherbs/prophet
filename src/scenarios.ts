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
      return this.histories["id"];
    }

    throw new Error(
      `Tried to retrieve history ${id} but didn't exist in ${this.histories}`
    );
  };

  setHistory = ({ id, history }: { id: string; history: HistoryProps }) => {
    return new Scenarios({
      histories: { ...this.histories, [id]: history },
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
