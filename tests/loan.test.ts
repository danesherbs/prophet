import Loan from "../src/loan";

const interestOnlyLoan = new Loan({
  amountBorrowed: 200_000,
  yearlyInterestRate: 0.065,
  monthlyFee: 10,
  isInterestOnly: true,
  lengthOfLoanInMonths: 12 * 30,
});

const principalAndInterestLoan = new Loan({
  amountBorrowed: 200_000,
  yearlyInterestRate: 0.065,
  monthlyFee: 10,
  isInterestOnly: false,
  lengthOfLoanInMonths: 12 * 30,
});

test("correct monthly repayments on principal interest loan", () => {
  expect(principalAndInterestLoan.getMonthlyPayment()).toBeCloseTo(1_274.14, 2);
});

test("correct monthly repayments on interest only loan", () => {
  expect(interestOnlyLoan.getMonthlyPayment()).toBeCloseTo(
    (0.065 * 200000) / 12 + 10,
    10
  );
});

test("monthly payments for principal and interest loans do not change month to month", () => {
  expect(
    principalAndInterestLoan.waitOneMonth().getMonthlyPayment()
  ).toBeCloseTo(principalAndInterestLoan.getMonthlyPayment(), 2);
});

test("monthly payments for interest only loans do not change month to month", () => {
  expect(interestOnlyLoan.waitOneMonth().getMonthlyPayment()).toBeCloseTo(
    interestOnlyLoan.getMonthlyPayment(),
    2
  );
});

test("loan length decreases over time", () => {
  expect(
    principalAndInterestLoan
      .waitOneMonth()
      .waitOneMonth()
      .waitOneMonth()
      .getLengthOfLoanInMonths()
  ).toEqual(principalAndInterestLoan.getLengthOfLoanInMonths() - 3);

  expect(
    principalAndInterestLoan
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .getLengthOfLoanInMonths()
  ).toEqual(principalAndInterestLoan.getLengthOfLoanInMonths() - 36);
});
