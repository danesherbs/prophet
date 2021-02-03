import Tax, { Props, TaxBracket } from "../tax";
import { getValueSafely } from "./utils";

const parser = (obj: Object): Tax | null => {
  try {
    const mapping = new Map(Object.entries(obj));

    return new Tax({
      incomeTaxBrackets: parseTaxBrackets(
        getValueSafely(mapping, "incomeTaxBrackets")
      ) as Props["incomeTaxBrackets"],
      superTaxRate: getValueSafely(
        mapping,
        "superTaxRate"
      ) as Props["superTaxRate"],
      declared: getValueSafely(mapping, "declared") as Props["declared"],
      paid: getValueSafely(mapping, "paid") as Props["paid"],
      description: mapping.get("description") as Props["description"],
    });
  } catch (error) {
    console.log("Couldn't parse", obj);
  }

  return null;
};

const parseTaxBrackets = (brackets: Array<TaxBracket>) => {
  for (let i = 0; i < brackets.length; i++) {
    const [[lo, hi], rate] = brackets[i];

    if (i < brackets.length - 1 && typeof hi !== "number") {
      throw new Error("Invalid hi bracket " + hi + " in " + brackets);
    }

    if (i === brackets.length - 1 && hi !== null) {
      throw new Error("Invalid hi bracket " + hi + " in " + brackets);
    }

    if (typeof lo !== "number") {
      throw new Error("Invalid low bracket " + lo + " in " + brackets);
    }

    if (typeof rate !== "number") {
      throw new Error("Invalid tax rate " + rate + " in " + brackets);
    }
  }

  if (brackets.length === 0) {
    return brackets;
  }

  const head = brackets.slice(0, -1);
  const [[[lo, hi], rate]] = brackets.slice(-1);

  return [...head, [[lo, Infinity], rate]];
};

export default parser;
export { parseTaxBrackets };
