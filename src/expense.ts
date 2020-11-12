import { Clock } from "./clock";


class Expense {

    yearlyIncrease: number;
    weeklyAmount: number;
    description: string;
    initialTime: number;

    constructor({ yearlyIncrease, weeklyAmount, description, initialTime }: { yearlyIncrease: number; weeklyAmount: number; description: string; initialTime: number }) {
        this.yearlyIncrease = yearlyIncrease;
        this.weeklyAmount = weeklyAmount;
        this.description = description;
        this.initialTime = initialTime;
    }

    getMonthlyAmount(time: number) {
        return ((this.weeklyAmount * 52) / 12) * Math.pow(1 + this.yearlyIncrease, time - Math.floor(this.initialTime / 12));
    }

    getDescription() {
        return this.description;
    }

}

export { Expense };