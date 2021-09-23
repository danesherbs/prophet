import Bank from "../src/bank";

const emptyBank = new Bank({
  transactions: new Array(),
  yearlyInterestRate: 0.03,
});

const nonemptyBank = new Bank({
  transactions: new Array(),
  yearlyInterestRate: 0.03,
})
  .deposit(0, 100, "Payday")
  .deposit(12, 100, "Payday")
  .deposit(24, 100, "Payday")
  .withdraw(24, 100, "Rent")
  .withdraw(36, 100, "Rent");

test("componding monthly correctly", () => {
  expect(Math.pow(1 + emptyBank.getMonthlyInterestRate(), 12)).toBeCloseTo(
    1.03,
    10
  );
});

test("correct bank balance with one transaction", () => {
  expect(emptyBank.deposit(0, 100, "Payday").getBalance(0)).toBeCloseTo(
    100,
    10
  );

  expect(emptyBank.deposit(0, 100, "Payday").getBalance(60)).toBeCloseTo(
    100 * Math.pow(1.03, 5),
    10
  );
});

test("correct bank balance with many transactions", () => {
  expect(
    emptyBank
      .deposit(0, 100, "Payday")
      .deposit(12, 100, "Payday")
      .deposit(24, 100, "Payday")
      .getBalance(36)
  ).toBeCloseTo(
    100 * Math.pow(1.03, 3) + 100 * Math.pow(1.03, 2) + 100 * Math.pow(1.03, 1),
    10
  );
});

test("correct bank balance with withdrawls and depositys", () => {
  expect(
    emptyBank
      .deposit(0, 100, "Payday")
      .deposit(12, 100, "Payday")
      .deposit(24, 100, "Payday")
      .withdraw(24, 100, "Rent")
      .withdraw(36, 100, "Rent")
      .getBalance(36)
  ).toBeCloseTo(
    100 * Math.pow(1.03, 3) + 100 * Math.pow(1.03, 2) - 100 * Math.pow(1.03, 0),
    10
  );
});

test("getter for transactions returns correct list of transactions", () => {
  const bank = new Bank({
    transactions: [
      [0, 100, "A"],
      [1, 200, "B"],
      [3, -30, "C"],
    ],
    yearlyInterestRate: 0.03,
  });

  expect(bank.getTransactions()).toEqual([
    [0, 100, "A"],
    [1, 200, "B"],
    [3, -30, "C"],
  ]);
});

test("negative balance is invalid", () => {
  const bank = new Bank({
    transactions: [
      [0, 100, "A"],
      [0, -200, "B"],
      [0, 300, "C"],
    ],
    yearlyInterestRate: 0.03,
  });

  expect(bank.isValidTransactions()).toBeFalsy();

  expect(bank.isValid()).toBeFalsy();
});

test("unrealistic interest rate is invalid", () => {
  const bank = new Bank({
    transactions: new Array(),
    yearlyInterestRate: 0.2,
  });

  expect(bank.isValidInterestRate()).toBeFalsy();

  expect(bank.isValid()).toBeFalsy();
});

test("correct bank balance after inflation", () => {
  const yearlyInflationRate = 0.1;

  expect(nonemptyBank.getBalance(0, yearlyInflationRate)).toBeCloseTo(
    nonemptyBank.getBalance(0, 0)
  );

  expect(nonemptyBank.getBalance(12 * 10, yearlyInflationRate)).toBeCloseTo(
    nonemptyBank.getBalance(12 * 10, 0) / Math.pow(1 + yearlyInflationRate, 10)
  );
});
