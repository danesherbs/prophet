import Loan from "../src/loan";

const interestOnlyLoan = new Loan({
  amountBorrowed: 200_000,
  yearlyInterestRate: 0.065,
  monthlyFee: 10,
  isInterestOnly: true,
  lengthOfLoanInYears: 30,
});

const principalAndInterestLoan = new Loan({
  amountBorrowed: 200_000,
  yearlyInterestRate: 0.065,
  monthlyFee: 10,
  isInterestOnly: false,
  lengthOfLoanInYears: 30,
});

test("correct monthly repayments on principal interest loan", () => {
  expect(principalAndInterestLoan.getMonthlyPayment()).toBeCloseTo(1_274.14, 2);
});

test("correct monthly repayments on interest only loan", () => {
  expect(interestOnlyLoan.getMonthlyPayment()).toBeCloseTo(
    (0.065 * 200000) / 12,
    2
  );
});
