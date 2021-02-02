import Stock, { Props } from "../stock";
import { toInteger, toNumber } from "lodash";

const parser = (obj: Props): Stock => {
  try {
    return new Stock({
      numberOfUnits: toInteger(obj.numberOfUnits) as Props["numberOfUnits"],
      pricePerUnit: toNumber(obj.pricePerUnit) as Props["pricePerUnit"],
      rateOfReturn: toNumber(obj.rateOfReturn) as Props["rateOfReturn"],
      initialTime: toInteger(obj.initialTime) as Props["initialTime"],
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
