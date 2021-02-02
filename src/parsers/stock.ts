import Stock, { Props } from "../stock";

const parser = (obj: Props): Stock => {
  try {
    return new Stock({
      numberOfUnits: obj.numberOfUnits as Props["numberOfUnits"],
      pricePerUnit: obj.pricePerUnit as Props["pricePerUnit"],
      rateOfReturn: obj.rateOfReturn as Props["rateOfReturn"],
      initialTime: obj.initialTime as Props["initialTime"],
    });
  } finally {
    console.log("Couldn't parse", obj);
  }
};

export default parser;
