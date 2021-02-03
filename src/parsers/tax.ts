import Tax, { Props } from "../tax";

const parser = (obj: Object): Tax | null => {
  try {
    return new Tax({
      incomeTaxBrackets: Object(obj)
        .incomeTaxBrackets as Props["incomeTaxBrackets"],
      superTaxRate: Object(obj).superTaxRate as Props["superTaxRate"],
      declared: Object(obj).declared as Props["declared"],
      paid: Object(obj).paid as Props["paid"],
      description: Object(obj).description as Props["description"],
    });
  } catch (error) {
    console.log("Couldn't parse", obj);
  }

  return null;
};

export default parser;
