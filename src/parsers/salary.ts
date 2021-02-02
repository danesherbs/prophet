import Salary, { Props } from "../salary";
import taxParser from "./tax";
import { toInteger, toNumber } from "lodash";

const parser = (obj: Props): Salary => {
  try {
    return new Salary({
      tax: taxParser(obj.tax) as Props["tax"],
      yearlyGrossSalary: toInteger(
        obj.yearlyGrossSalary
      ) as Props["yearlyGrossSalary"],
      yearlySalaryIncrease: toNumber(
        obj.yearlySalaryIncrease
      ) as Props["yearlySalaryIncrease"],
      creationTime: toInteger(obj.creationTime) as Props["creationTime"],
      description: obj.description as Props["description"],
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
