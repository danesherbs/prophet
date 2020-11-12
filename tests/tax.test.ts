import { Tax } from "../src/tax";


test('correct income tax with single bracket', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(
            [[0.0, 60_000], 0.0],
            [[60_001, Infinity], 0.2],
        ),
        declared: new Array(),
        paid: new Array()
    });

    expect(tax.getYearlyIncomeTax(120_000)).toEqual((60_000 - 1) * 0.2);
});

test('correct income tax with multiple brackets', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(
            [[0.0, 20_000], 0.0],
            [[20_001, 60_000], 0.2],
            [[60_001, Infinity], 0.5],
        ),
        declared: new Array(),
        paid: new Array()
    });

    expect(tax.getYearlyIncomeTax(120_000)).toEqual((40_000 - 1) * 0.2 + (60_000 - 1) * 0.5);
});
