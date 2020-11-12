import { Tax } from "../src/tax";
import { Super } from "../src/super";


test('correct monthly gross super contributions', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
    });

    const superan = new Super({
        tax: tax,
        transactions: new Array(),
        interestRate: 0.1,
        contributionRate: 0.125,
    });

    expect(superan.getMonthlyGrossSuperContribution(120_000)).toEqual(120_000 * 0.125 / 12);
});

test('correct monthly net super contributions', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
    });

    const superan = new Super({
        tax: tax,
        transactions: new Array(),
        interestRate: 0.1,
        contributionRate: 0.125,
    });

    expect(superan.getMonthlyNetSuperContribution(120_000)).toEqual(120_000 * 0.125 * (1 - 0.15) / 12);
});
