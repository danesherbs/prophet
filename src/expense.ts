interface Props {
  yearlyIncrease: number;
  weeklyAmount: number;
  description: string;
  initialTime: number;
}

class Expense {
  yearlyIncrease: number;
  weeklyAmount: number;
  description: string;
  initialTime: number;

  constructor({
    yearlyIncrease,
    weeklyAmount,
    description,
    initialTime,
  }: Props) {
    this.yearlyIncrease = yearlyIncrease;
    this.weeklyAmount = weeklyAmount;
    this.description = description;
    this.initialTime = initialTime;
  }

  getYearlyIncrease() {
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

  getDescription() {
    return this.description;
  }

  getInitialTime() {
    return this.initialTime;
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
export { Props };
