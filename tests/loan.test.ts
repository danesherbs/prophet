import Loan from "../src/loan";

const interestOnlyLoan = new Loan({
  amount: 120_000,
  yearlyInterestRate: 0.05,
  monthlyFee: 10,
  interestOnly: true,
});

const principalAndInterestLoan = new Loan({
  amount: 120_000,
  yearlyInterestRate: 0.05,
  monthlyFee: 10,
  interestOnly: false,
  lengthOfLoanInYears: 30,
});

test("correct monthly repayments on interest only loan", () => {
  expect(interestOnlyLoan.getMonthlyInterestPayment()).toBeCloseTo(0, 10);
});

test("correct monthly repayments on principal and interest loan", () => {
  expect(principalAndInterestLoan.getMonthlyInterestPayment()).toBeCloseTo(
    28391,
    10
  );
});

test("correct monthly interest rates", () => {
  expect(interestOnlyLoan.getMonthlyInterestRate()).toBeCloseTo(0.05, 10);

  expect(principalAndInterestLoan.getMonthlyInterestRate()).toBeCloseTo(0, 10);
});
