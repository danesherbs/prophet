enum RepaymentFrequency {
  Weekly,
  Fortnightly,
  Monthly,
  Quarterly,
  Yearly,
}

class Loan {
  amount: number;
  yearlyInterestRate: number;
  monthlyFee: number;
  interestOnly: boolean;
  lengthOfLoanInYears: number | undefined;

  constructor({
    amount,
    yearlyInterestRate,
    monthlyFee,
    interestOnly,
    lengthOfLoanInYears,
  }: {
    amount: number;
    yearlyInterestRate: number;
    monthlyFee: number;
    interestOnly: boolean;
    lengthOfLoanInYears?: number;
  }) {
    this.amount = amount;
    this.yearlyInterestRate = yearlyInterestRate;
    this.monthlyFee = monthlyFee;
    this.interestOnly = interestOnly;
    this.lengthOfLoanInYears = lengthOfLoanInYears;

    if (!this.interestOnly && this.lengthOfLoanInYears === undefined) {
      throw new RangeError(
        "Must specify length of loan for principal and interest loan."
      );
    }
  }

  getMonthlyInterestRate() {
    return Math.pow(1 + this.yearlyInterestRate, 1 / 12) - 1;
  }

  getMonthlyInterestPayment() {
    if (this.interestOnly) {
      return (this.amount * this.yearlyInterestRate) / 12;
    }

    if (this.lengthOfLoanInYears === undefined) {
      throw new RangeError(
        "Must specify length of loan for principal and interest loan."
      );
    }

    return (
      (this.amount * this.yearlyInterestRate) / 12 +
      this.amount / this.lengthOfLoanInYears
    ); // mortgage repayments
  }

  getPrincipalRemaining(time: number) {
    return Infinity;
  }
}

export default Loan;
