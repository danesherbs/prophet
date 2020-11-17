import { Tax } from "../src/tax";


test('correct yearly income tax with single bracket', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(
            [[0.0, 60_000], 0.0],
            [[60_001, Infinity], 0.2],
        ),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
    });

    expect(tax.getYearlyIncomeTax(120_000)).toEqual((60_000 - 1) * 0.2);
});

test('correct monthly income tax with single bracket', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(
            [[0.0, 60_000], 0.0],
            [[60_001, Infinity], 0.2],
        ),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
    });

    expect(tax.getMonthlyIncomeTax(120_000)).toEqual((60_000 - 1) * 0.2 / 12);
});

test('correct yearly income tax with multiple brackets', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(
            [[0.0, 20_000], 0.0],
            [[20_001, 60_000], 0.2],
            [[60_001, Infinity], 0.5],
        ),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
    });

    expect(tax.getYearlyIncomeTax(120_000)).toEqual((40_000 - 1) * 0.2 + (60_000 - 1) * 0.5);
});

test('correct monthly income tax with multiple brackets', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(
            [[0.0, 20_000], 0.0],
            [[20_001, 60_000], 0.2],
            [[60_001, Infinity], 0.5],
        ),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
    });

    expect(tax.getMonthlyIncomeTax(120_000)).toEqual(((40_000 - 1) * 0.2 + (60_000 - 1) * 0.5) / 12);
});

test('correct monthly super tax with multiple brackets', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(
            [[0.0, 20_000], 0.0],
            [[20_001, 60_000], 0.2],
            [[60_001, Infinity], 0.5],
        ),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
    });

    expect(tax.getMonthlySuperTax(10_000)).toEqual(10_000 * 0.15);
});

// TODO: Add tax refund test
