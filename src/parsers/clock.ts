import Clock, { Props } from "../clock";
import { toInteger } from "lodash";

const parser = (obj: Props): Clock => {
  try {
    return new Clock(toInteger(obj.time) as Props["time"]);
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
