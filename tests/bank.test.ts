import { Bank } from "../src/bank";


test('componding monthly correctly', () => {
    const bank = new Bank(new Array(), 0.03);

    expect(Math.pow(1 + bank.getMonthlyInterestRate(), 12)).toBeCloseTo(1.03, 10);
});

test('correct bank balance with one transaction', () => {
    const bank = new Bank(new Array(), 0.03);

    expect(bank.deposit(0, 100, "Payday").getBalance(0)).toBeCloseTo(100, 10);
    expect(bank.deposit(0, 100, "Payday").getBalance(60)).toBeCloseTo(100 * Math.pow(1.03, 5), 10);
});

test('correct bank balance with many transactions', () => {
    const bank = new Bank(new Array(), 0.03);

    expect(bank
        .deposit(0, 100, "Payday")
        .deposit(12, 100, "Payday")
        .deposit(24, 100, "Payday")
        .getBalance(36))
        .toBeCloseTo(
            100 * Math.pow(1.03, 3) +
            100 * Math.pow(1.03, 2) +
            100 * Math.pow(1.03, 1),
            10);
});

test('correct bank balance with withdrawls and depositys', () => {
    const bank = new Bank(new Array(), 0.03);

    expect(bank
        .deposit(0, 100, "Payday")
        .deposit(12, 100, "Payday")
        .deposit(24, 100, "Payday")
        .withdraw(24, 100, "Rent")
        .withdraw(36, 100, "Rent")
        .getBalance(36))
        .toBeCloseTo(
            100 * Math.pow(1.03, 3) +
            100 * Math.pow(1.03, 2) -
            100 * Math.pow(1.03, 0),
            10);
});