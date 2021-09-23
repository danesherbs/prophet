import { toMonthlyRate, toWeeklyRate } from "./utils";

interface Props {
  yearlyIncrease: number;
  weeklyAmount: number;
  initialTime: number;
  description?: string;
}

class Expense {
  yearlyIncrease: number;
  weeklyAmount: number;
  initialTime: number;
  description?: string;

  constructor({
    yearlyIncrease,
    weeklyAmount,
    initialTime,
    description,
  }: Props) {
    this.yearlyIncrease = yearlyIncrease;
    this.weeklyAmount = weeklyAmount;
    this.initialTime = initialTime;
    this.description = description;
  }

  getYearlyIncrease() {
    /* istanbul ignore next */
    return this.yearlyIncrease;
  }

  getWeeklyAmount(time: number, yearlyInflationRate?: number) {
    return (
      (this.weeklyAmount *
        Math.pow(
          1 + this.yearlyIncrease,
          Math.floor((time - this.initialTime) / 12)
        )) /
      Math.pow(
        1 + toMonthlyRate(yearlyInflationRate || 0),
        time - this.initialTime
      )
    );
  }

  getInitialTime() {
    /* istanbul ignore next */
    return this.initialTime;
  }

  getDescription() {
    /* istanbul ignore next */
    return this.description;
  }

  getProps(): Props {
    /* istanbul ignore next */
    if (this.description !== undefined) {
      return {
        yearlyIncrease: this.yearlyIncrease,
        weeklyAmount: this.weeklyAmount,
        initialTime: this.initialTime,
        description: this.description,
      };
    }

    return {
      yearlyIncrease: this.yearlyIncrease,
      weeklyAmount: this.weeklyAmount,
      initialTime: this.initialTime,
    };
  }

  getMonthlyAmount(time: number, yearlyInflationRate?: number) {
    return (
      (((this.weeklyAmount * 52) / 12) *
        Math.pow(
          1 + this.yearlyIncrease,
          Math.floor((time - this.initialTime) / 12)
        )) /
      Math.pow(
        1 + toMonthlyRate(yearlyInflationRate || 0),
        time - this.initialTime
      )
    );
  }
}

export default Expense;
export type { Props };
