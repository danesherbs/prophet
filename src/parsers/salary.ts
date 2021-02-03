import Salary, { Props } from "../salary";
import taxParser from "./tax";
import { toInteger, toNumber } from "lodash";

const parser = (obj: Object): Salary | null => {
  try {
    return new Salary({
      tax: taxParser(Object(obj).tax) as Props["tax"],
      yearlyGrossSalary: toInteger(
        Object(obj).yearlyGrossSalary
      ) as Props["yearlyGrossSalary"],
      yearlySalaryIncrease: toNumber(
        Object(obj).yearlySalaryIncrease
      ) as Props["yearlySalaryIncrease"],
      creationTime: toInteger(
        Object(obj).creationTime
      ) as Props["creationTime"],
      description: Object(obj).description as Props["description"],
    });
  } catch (error) {
    console.log("Couldn't parse", obj);
  }

  return null;
};

export default parser;
