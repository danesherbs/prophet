import { Tax, TaxType } from "../src/tax";


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

    expect(tax.getYearlyIncomeTax(120_000))
        .toEqual((60_000 - 1) * 0.2);
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

    expect(tax.getMonthlyIncomeTax(120_000))
        .toEqual((60_000 - 1) * 0.2 / 12);
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

    expect(tax.getYearlyIncomeTax(120_000))
        .toEqual((40_000 - 1) * 0.2 + (60_000 - 1) * 0.5);
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

    expect(tax.getMonthlyIncomeTax(120_000))
        .toEqual(((40_000 - 1) * 0.2 + (60_000 - 1) * 0.5) / 12);
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

    expect(tax.getMonthlySuperTax(10_000))
        .toEqual(10_000 * 0.15);
});

test('correct declared income in calendar year', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(
            [[0.0, 20_000], 0.0],
            [[20_001, 60_000], 0.2],
            [[60_001, Infinity], 0.5],
        ),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
    })
        .declareIncome(1, 10_000)
        .declareIncome(6, 25_000)
        .declareIncome(12, 30_000)
        .declareIncome(18, 40_000)
        .declareIncome(24, 50_000);

    expect(tax.getDeclaredIncomeOverLastTwelveMonths(0)).toEqual(0);
    expect(tax.getDeclaredIncomeOverLastTwelveMonths(1)).toEqual(10_000);
    expect(tax.getDeclaredIncomeOverLastTwelveMonths(6)).toEqual(35_000);
    expect(tax.getDeclaredIncomeOverLastTwelveMonths(11)).toEqual(35_000);
    expect(tax.getDeclaredIncomeOverLastTwelveMonths(12)).toEqual(65_000);
    expect(tax.getDeclaredIncomeOverLastTwelveMonths(18)).toEqual(70_000);
    expect(tax.getDeclaredIncomeOverLastTwelveMonths(24)).toEqual(90_000);
});

test('correct paid income tax in calendar year', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(
            [[0.0, 20_000], 0.0],
            [[20_001, 60_000], 0.2],
            [[60_001, Infinity], 0.5],
        ),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
    })
        .payTax(1, 10_000, TaxType.Income)
        .payTax(6, 25_000, TaxType.Income)
        .payTax(12, 30_000, TaxType.Income)
        .payTax(18, 40_000, TaxType.Income)
        .payTax(24, 50_000, TaxType.Income);

    expect(tax.getPaidIncomeTaxOverLastTwelveMonths(0)).toEqual(0);
    expect(tax.getPaidIncomeTaxOverLastTwelveMonths(1)).toEqual(10_000);
    expect(tax.getPaidIncomeTaxOverLastTwelveMonths(6)).toEqual(35_000);
    expect(tax.getPaidIncomeTaxOverLastTwelveMonths(11)).toEqual(35_000);
    expect(tax.getPaidIncomeTaxOverLastTwelveMonths(12)).toEqual(65_000);
    expect(tax.getPaidIncomeTaxOverLastTwelveMonths(18)).toEqual(70_000);
    expect(tax.getPaidIncomeTaxOverLastTwelveMonths(24)).toEqual(90_000);
});

test('correct losses in calendar year', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(
            [[0.0, 20_000], 0.0],
            [[20_001, 60_000], 0.2],
            [[60_001, Infinity], 0.5],
        ),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
    })
        .declareLoss(1, 10_000)
        .declareLoss(6, 25_000)
        .declareLoss(12, 30_000)
        .declareLoss(18, 40_000)
        .declareLoss(24, 50_000);

    expect(tax.getLossesOverLastTwelveMonths(0)).toEqual(0);
    expect(tax.getLossesOverLastTwelveMonths(1)).toEqual(10_000);
    expect(tax.getLossesOverLastTwelveMonths(6)).toEqual(35_000);
    expect(tax.getLossesOverLastTwelveMonths(11)).toEqual(35_000);
    expect(tax.getLossesOverLastTwelveMonths(12)).toEqual(65_000);
    expect(tax.getLossesOverLastTwelveMonths(18)).toEqual(70_000);
    expect(tax.getLossesOverLastTwelveMonths(24)).toEqual(90_000);
});

test('correct net tax owed over last year', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(
            [[0.0, 120_000], 0.5],
        ),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
    })
        .declareIncome(1, 120_000)
        .payTax(1, 30_000, TaxType.Income)
        .declareLoss(1, 10_000);

    expect(tax.getNetTaxOverLastTwelveMonths(0))
        .toEqual(0);

    expect(tax.getNetTaxOverLastTwelveMonths(11))
        .toEqual(120_000 * 0.5 - 30_000 - 10_000);

    expect(tax.getNetTaxOverLastTwelveMonths(13))
        .toEqual(0);
});

// TODO: Add tax refund test
