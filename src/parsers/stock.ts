import Stock, { Props } from "../stock";

const parser = (obj: Object): Stock | null => {
  try {
    return new Stock({
      numberOfUnits: Object(obj).numberOfUnits as Props["numberOfUnits"],
      pricePerUnit: Object(obj).pricePerUnit as Props["pricePerUnit"],
      rateOfReturn: Object(obj).rateOfReturn as Props["rateOfReturn"],
      initialTime: Object(obj).initialTime as Props["initialTime"],
    });
  } catch (error) {
    console.log("Couldn't parse", obj);
  }

  return null;
};

export default parser;
