import { toArray, toNumber } from "lodash";
import Tax, { Props } from "../tax";

const parser = (obj: Props): Tax => {
  try {
    return new Tax({
      incomeTaxBrackets: toArray(
        obj.incomeTaxBrackets
      ) as Props["incomeTaxBrackets"],
      superTaxRate: toNumber(obj.superTaxRate) as Props["superTaxRate"],
      declared: toArray(obj.declared) as Props["declared"],
      paid: toArray(obj.paid) as Props["paid"],
      description: obj.description as Props["description"],
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
