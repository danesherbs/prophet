import History, { Props } from "../history";
import stateParser from "./state";
import { toArray } from "lodash";

const parser = (obj: Props): History => {
  try {
    return new History({
      history: (obj.history as Props["history"]).map((state) =>
        stateParser(state)
      ),
      events: toArray(obj.events) as Props["events"],
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
