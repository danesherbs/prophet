import Salary, { Props } from "../salary";
import taxParser from "./tax";

const parser = (obj: Props): Salary => {
  try {
    return new Salary({
      tax: taxParser(obj.tax) as Props["tax"],
      yearlyGrossSalary: obj.yearlyGrossSalary as Props["yearlyGrossSalary"],
      yearlySalaryIncrease: obj.yearlySalaryIncrease as Props["yearlySalaryIncrease"],
      creationTime: obj.creationTime as Props["creationTime"],
      description: obj.description as Props["description"],
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
