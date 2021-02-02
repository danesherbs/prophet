import Tax, { Props } from "../tax";
import { toNumber } from "lodash";

const parser = (obj: Props): Tax => {
  try {
    return new Tax({
      incomeTaxBrackets: obj.incomeTaxBrackets as Props["incomeTaxBrackets"],
      superTaxRate: toNumber(obj.superTaxRate) as Props["superTaxRate"],
      declared: obj.declared as Props["declared"],
      paid: obj.paid as Props["paid"],
      description: obj.description as Props["description"],
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
