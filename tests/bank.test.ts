import { Bank } from "../src/bank";


const bank = new Bank({
    transactions: new Array(),
    interestRate: 0.03
});

test('componding monthly correctly', () => {
    expect(Math.pow(1 + bank.getMonthlyInterestRate(), 12))
        .toBeCloseTo(1.03, 10);
});

test('correct bank balance with one transaction', () => {
    expect(bank.deposit(0, 100, "Payday").getBalance(0))
        .toBeCloseTo(100, 10);

    expect(bank.deposit(0, 100, "Payday").getBalance(60))
        .toBeCloseTo(100 * Math.pow(1.03, 5), 10);
});

test('correct bank balance with many transactions', () => {
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

test('getter for transactions returns correct list of transactions', () => {
    const bank = new Bank({
        transactions: [
            [0, 100, "A"],
            [1, 200, "B"],
            [3, -30, "C"],
        ],
        interestRate: 0.03
    });

    expect(bank.getTransactions())
        .toEqual([
            [0, 100, "A"],
            [1, 200, "B"],
            [3, -30, "C"],
        ]);
});

test('negative balance is invalid', () => {
    const bank = new Bank({
        transactions: [
            [0, 100, "A"],
            [0, -200, "B"],
            [0, 300, "C"],
        ],
        interestRate: 0.03
    });

    expect(bank.isValidTransactions())
        .toBeFalsy();

    expect(bank.isValid())
        .toBeFalsy();
});

test('unrealistic interest rate is invalid', () => {
    const bank = new Bank({
        transactions: new Array(),
        interestRate: 0.20
    });

    expect(bank.isValidInterestRate())
        .toBeFalsy();

    expect(bank.isValid())
        .toBeFalsy();
});
