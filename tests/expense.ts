import { Expense } from "../src/expense";


test('correct monthly expenses', () => {
    const expense = new Expense({
        yearlyIncrease: 0.03,
        weeklyAmount: 120,
        description: "Living expenses",
        initialTime: 0,
    });

    expect(expense.getMonthlyAmount(0)).toBeCloseTo(120 * 52 / 12, 10);
});

test('monthly expenses increasing yearly', () => {
    const expense = new Expense({
        yearlyIncrease: 0.03,
        weeklyAmount: 120,
        description: "Living expenses",
        initialTime: 0,
    });

    expect(expense.getMonthlyAmount(12)).toBeCloseTo((120 * 52 / 12) * 1.03, 10);
    expect(expense.getMonthlyAmount(48)).toBeCloseTo((120 * 52 / 12) * Math.pow(1.03, 4), 10);
});
