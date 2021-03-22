enum DeclarationType {
  Income = "Income",
  Loss = "Loss",
}

enum TaxType {
  Income = "Income",
  Super = "Super",
}

type IncomeBracket = [number, number | null];
type TaxRate = number;
type TaxBracket = [IncomeBracket, TaxRate];

interface Props {
  incomeTaxBrackets: Array<TaxBracket>;
  superTaxRate: number;
  declared: Array<[number, number, DeclarationType]>;
  paid: Array<[number, number, TaxType]>;
  description?: string;
}

class Tax {
  incomeTaxBrackets: Array<TaxBracket>;
  superTaxRate: number;
  declared: Array<[number, number, DeclarationType]>;
  paid: Array<[number, number, TaxType]>;

  constructor({ incomeTaxBrackets, superTaxRate, declared, paid }: Props) {
    this.incomeTaxBrackets = incomeTaxBrackets;
    this.superTaxRate = superTaxRate;
    this.declared = declared;
    this.paid = paid;
  }

  getProps(): Props {
    return {
      incomeTaxBrackets: this.incomeTaxBrackets,
      superTaxRate: this.superTaxRate,
      declared: this.declared,
      paid: this.paid,
    };
  }

  getIncomeTaxBrackets() {
    /* istanbul ignore next */
    return this.incomeTaxBrackets;
  }

  getSuperTaxRate() {
    /* istanbul ignore next */
    return this.superTaxRate;
  }

  getDeclared() {
    /* istanbul ignore next */
    return this.declared;
  }

  getPaid() {
    /* istanbul ignore next */
    return this.paid;
  }

  getYearlyIncomeTax(yearlyGrossSalary: number) {
    return this.incomeTaxBrackets.reduce((acc, [[lo, hi], rate]) => {
      return (
        acc +
        Math.min(Math.max(0, yearlyGrossSalary - lo), (hi || Infinity) - lo) *
          rate
      );
    }, 0);
  }

  getMonthlyIncomeTax(yearlyGrossSalary: number) {
    return this.getYearlyIncomeTax(yearlyGrossSalary) / 12;
  }

  getMonthlySuperTax(monthlyGrossSuperContribution: number) {
    return this.superTaxRate * monthlyGrossSuperContribution;
  }

  getDeclaredIncomeOverLastTwelveMonths(time: number) {
    /*
    Gets declared income in last 12 months, upto and including the current month.

    Example:
    --------
    If called on June 2020, it'd calculate the declared income from July 2019 to June 2020.
    */
    return this.declared
      .filter(
        ([t, , type]) =>
          time - 12 < t && t <= time && type === DeclarationType.Income
      )
      .reduce((acc, [, amount]) => acc + amount, 0);
  }

  getLossesOverLastTwelveMonths(time: number) {
    /*
    Gets losses in last 12 months, upto and including the current month.

    Example:
    --------
    If called on June 2020, it'd calculate the losses from July 2019 to June 2020.
    */
    return this.declared
      .filter(
        ([t, , type]) =>
          time - 12 < t && t <= time && type === DeclarationType.Loss
      )
      .reduce((acc, [, amount]) => acc + amount, 0);
  }

  getPaidIncomeTaxOverLastTwelveMonths(time: number) {
    /*
    Gets paid income tax in last 12 months, upto and including the current month.

    Example:
    --------
    If called on June 2020, it'd calculate the paid income tax from July 2019 to June 2020.
    */
    return this.paid
      .filter(
        ([t, , type]) => time - 12 < t && t <= time && type === TaxType.Income
      )
      .reduce((acc, [, amount]) => acc + amount, 0);
  }

  getNetUnpaidTaxOverLastTwelveMonths(time: number) {
    return (
      this.getYearlyIncomeTax(
        this.getDeclaredIncomeOverLastTwelveMonths(time)
      ) -
      this.getPaidIncomeTaxOverLastTwelveMonths(time) -
      this.getLossesOverLastTwelveMonths(time)
    );
  }

  declareIncome(time: number, amount: number) {
    return new Tax({
      incomeTaxBrackets: this.incomeTaxBrackets,
      superTaxRate: this.superTaxRate,
      declared: new Array(...this.declared, [
        time,
        amount,
        DeclarationType.Income,
      ]),
      paid: this.paid,
    });
  }

  declareLoss(time: number, amount: number) {
    return new Tax({
      incomeTaxBrackets: this.incomeTaxBrackets,
      superTaxRate: this.superTaxRate,
      declared: new Array(...this.declared, [
        time,
        amount,
        DeclarationType.Loss,
      ]),
      paid: this.paid,
    });
  }

  payTax(time: number, amount: number, type: TaxType) {
    return new Tax({
      incomeTaxBrackets: this.incomeTaxBrackets,
      superTaxRate: this.superTaxRate,
      declared: this.declared,
      paid: new Array(...this.paid, [time, amount, type]),
    });
  }
}

export default Tax;
export type { Props };
export { TaxType, TaxBracket };
