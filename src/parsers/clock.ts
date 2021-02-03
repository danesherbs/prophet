import Clock, { Props } from "../clock";

const parser = (obj: Object): Clock | null => {
  try {
    return new Clock(Object(obj).time as Props["time"]);
  } catch (error) {
    console.log("Couldn't parse", obj);
  }

  return null;
};

export default parser;
