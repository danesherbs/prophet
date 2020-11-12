import { Clock } from "./clock";


class Expense {

    yearlyIncrease: number;
    monthlyAmount: number;
    description: string;
    initialTime: number;

    constructor({ yearlyIncrease, amount, description, initialTime }: { yearlyIncrease: number; amount: number; description: string; initialTime: number }) {
        this.yearlyIncrease = yearlyIncrease;
        this.monthlyAmount = amount;
        this.description = description;
        this.initialTime = initialTime;
    }

    getMonthlyAmount(time: number) {
        return this.monthlyAmount * Math.pow(1 + this.yearlyIncrease, time - Math.floor(this.initialTime / 12));
    }

    getDescription() {
        return this.description;
    }

}

export { Expense };