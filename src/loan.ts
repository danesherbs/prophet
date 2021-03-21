interface Props {
  amountBorrowed: number;
  yearlyInterestRate: number;
  monthlyFee: number;
  isInterestOnly: boolean;
  lengthOfLoanInMonths: number;
}

class Loan {
  amountBorrowed: number;
  yearlyInterestRate: number;
  monthlyFee: number;
  isInterestOnly: boolean;
  lengthOfLoanInMonths: number;

  constructor({
    amountBorrowed,
    yearlyInterestRate,
    monthlyFee,
    isInterestOnly,
    lengthOfLoanInMonths,
  }: Props) {
    this.amountBorrowed = amountBorrowed;
    this.yearlyInterestRate = yearlyInterestRate;
    this.monthlyFee = monthlyFee;
    this.isInterestOnly = isInterestOnly;
    this.lengthOfLoanInMonths = lengthOfLoanInMonths;

    if (!this.isInterestOnly && this.lengthOfLoanInMonths === undefined) {
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

  getLengthOfLoanInMonths() {
    /* istanbul ignore next */
    return this.lengthOfLoanInMonths;
  }

  getProps(): Props {
    /* istanbul ignore next */
    return {
      amountBorrowed: this.amountBorrowed,
      yearlyInterestRate: this.yearlyInterestRate,
      monthlyFee: this.monthlyFee,
      isInterestOnly: this.isInterestOnly,
      lengthOfLoanInMonths: this.lengthOfLoanInMonths,
    };
  }

  getMonthlyInterestRate() {
    return this.yearlyInterestRate / 12;
  }

  getMonthlyPayment() {
    if (this.lengthOfLoanInMonths <= 0) {
      return 0;
    }

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
    const N = this.lengthOfLoanInMonths;

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
      lengthOfLoanInMonths: Math.max(this.lengthOfLoanInMonths - 1, 0),
    });
  }

  waitOneYear() {
    let loan: Loan = this;

    for (let i = 0; i < 12; i++) {
      loan = loan.waitOneMonth();
    }

    return loan;
  }
}

export default Loan;
export type { Props };
