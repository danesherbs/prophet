import History, { Props } from "../history";
import stateParser from "./state";

const parser = (obj: Object): History | null => {
  try {
    return new History({
      history: (Object(obj).history as Array<any>).map((state) =>
        stateParser(state)
      ) as Props["history"],
      events: Object(obj).events as Props["events"], // TODO: parse events
    });
  } catch (error) {
    console.log("Couldn't parse", obj);
  }

  return null;
};

export default parser;
