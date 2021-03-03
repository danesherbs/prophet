class Loan {
  amountBorrowed: number;
  yearlyInterestRate: number;
  monthlyFee: number;
  isInterestOnly: boolean;
  lengthOfLoanInYears: number;
  constructor({
    amountBorrowed,
    yearlyInterestRate,
    monthlyFee,
    isInterestOnly,
    lengthOfLoanInYears,
  }: {
    amountBorrowed: number;
    yearlyInterestRate: number;
    monthlyFee: number;
    isInterestOnly: boolean;
    lengthOfLoanInYears: number;
  }) {
    this.amountBorrowed = amountBorrowed;
    this.yearlyInterestRate = yearlyInterestRate;
    this.monthlyFee = monthlyFee;
    this.isInterestOnly = isInterestOnly;
    this.lengthOfLoanInYears = lengthOfLoanInYears;

    if (!this.isInterestOnly && this.lengthOfLoanInYears === undefined) {
      throw new RangeError(
        "Must specify length of loan for principal and interest loan."
      );
    }
  }

  getAmountBorrowed() {
    /* istanbul ignore next */
    return this.amountBorrowed;
  }

  getYearlyInterestRate() {
    /* istanbul ignore next */
    return this.yearlyInterestRate;
  }

  getMonthlyInterestRate() {
    return this.yearlyInterestRate / 12;
  }

  getMonthlyPayment() {
    if (this.isInterestOnly) {
      return this.getMonthlyInterestOnlyPayment() + this.monthlyFee;
    }

    return this.getMonthlyPrincipleAndInterestPayment() + this.monthlyFee;
  }

  getMonthlyInterestOnlyPayment() {
    return (this.amountBorrowed * this.yearlyInterestRate) / 12;
  }

  getMonthlyPrincipleAndInterestPayment() {
    /*
    Source: https://en.wikipedia.org/wiki/Mortgage_calculator#cite_note-4
    */
    const r = this.getMonthlyInterestRate();
    const P = this.amountBorrowed;
    const N = this.lengthOfLoanInYears * 12;

    if (0 < r && r < 1e-3) {
      return P / N;
    }

    return (r * P * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
  }

  waitOneMonth() {
    return new Loan({
      amountBorrowed:
        this.amountBorrowed * (1 + this.getMonthlyInterestRate()) -
        (this.isInterestOnly
          ? this.getMonthlyInterestOnlyPayment()
          : this.getMonthlyPrincipleAndInterestPayment()),
      yearlyInterestRate: this.yearlyInterestRate,
      monthlyFee: this.monthlyFee,
      isInterestOnly: this.isInterestOnly,
      lengthOfLoanInYears: this.lengthOfLoanInYears - 1 / 12,
    });
  }

  // getMonthlyInterestRate() {
  //   return Math.pow(1 + this.yearlyInterestRate, 1 / 12) - 1;
  // }

  // getMonthlyInterestPayment() {
  //   if (this.isInterestOnly) {
  //     return (this.amountBorrowed * this.yearlyInterestRate) / 12;
  //   }

  //   if (this.lengthOfLoanInYears === undefined) {
  //     throw new RangeError(
  //       "Must specify length of loan for principal and interest loan."
  //     );
  //   }

  //   return (
  //     (this.amountBorrowed * this.yearlyInterestRate) / 12 +
  //     this.amountBorrowed / this.lengthOfLoanInYears
  //   ); // mortgage repayments
  // }

  // getPrincipalRemaining(time: number) {
  //   return Infinity;
  // }
}

export default Loan;
