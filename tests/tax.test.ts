import { Tax } from "../src/tax";


test('correct net wealth for model with salary only', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(
            [[0.0, 60_000], 0.0],
            [[60_001, Infinity], 0.2],
        ),
        declared: new Array(),
        paid: new Array()
    });

    expect(tax.getYearlyIncomeTax(120_000)).toEqual(60_000 * 0.2);
});
