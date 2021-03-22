interface Props {
  yearlyIncrease: number;
  weeklyAmount: number;
  initialTime: number;
}

class Expense {
  yearlyIncrease: number;
  weeklyAmount: number;
  initialTime: number;

  constructor({ yearlyIncrease, weeklyAmount, initialTime }: Props) {
    this.yearlyIncrease = yearlyIncrease;
    this.weeklyAmount = weeklyAmount;
    this.initialTime = initialTime;
  }

  getYearlyIncrease() {
    /* istanbul ignore next */
    return this.yearlyIncrease;
  }

  getWeeklyAmount(time: number) {
    return (
      this.weeklyAmount *
      Math.pow(
        1 + this.yearlyIncrease,
        Math.floor((time - this.initialTime) / 12)
      )
    );
  }

  getInitialTime() {
    /* istanbul ignore next */
    return this.initialTime;
  }

  getProps(): Props {
    /* istanbul ignore next */
    return {
      yearlyIncrease: this.yearlyIncrease,
      weeklyAmount: this.weeklyAmount,
      initialTime: this.initialTime,
    };
  }

  getMonthlyAmount(time: number) {
    return (
      ((this.weeklyAmount * 52) / 12) *
      Math.pow(
        1 + this.yearlyIncrease,
        Math.floor((time - this.initialTime) / 12)
      )
    );
  }
}

export default Expense;
export type { Props };
