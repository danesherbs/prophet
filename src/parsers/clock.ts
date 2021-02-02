import Clock, { Props } from "../clock";

const parser = (obj: Props): Clock => {
  try {
    return new Clock(obj.time as Props["time"]);
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
