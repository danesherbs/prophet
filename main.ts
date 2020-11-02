class Clock {

    time = 0;

    tick() {
        this.time += 1;
    }

    getTime() {
        return this.time;
    }

}

class Salary {

    clock: Clock;
    salary: number;
    tax: Tax;

    constructor(clock: Clock, salary: number, tax: Tax) {
        this.clock = clock;
        this.salary = salary;
        this.tax = tax;
    }

    getMonthlyGrossSalary() {
        return this.salary / 12.0;
    }

    getMonthlyNetSalary() {
        return this.getMonthlyGrossSalary() - this.tax.getIncomeTax(this.getMonthlyGrossSalary());
    }

}

class Tax {

    clock: Clock;
    records: Array<[number, number]>;

    constructor(clock: Clock, records: Array<[number, number]>) {
        this.clock = clock;
        this.records = records;
    }

    getIncomeTax(income: number) {
        return 0.5 * income;
    }

    getTaxRecords() {
        return this.records;
    }

    getNetTax(time: number, deductions: number) {
        return this.records
            .filter(([t, _]) => t === time)
            .reduce((acc, [_, amount]) => acc + this.getIncomeTax(amount), 0) - deductions;
    }

    declareIncome(income: number) {
        return new Tax(
            clock,
            new Array<[number, number]>(...this.records, [clock.getTime(), income]));
    }

}

type Transaction = [number, number];

class Bank {

    transactions: Array<Transaction>;
    interestRate: number;
    clock: Clock;

    constructor(clock: Clock, transactions: Array<Transaction>, interestRate: number) {
        this.transactions = transactions;
        this.interestRate = interestRate;
        this.clock = clock;
    }

    deposit(amount: number) {
        if (Math.abs(amount) <= 1e-6) {
            return this;
        }

        return new Bank(
            this.clock,
            new Array<Transaction>(...this.transactions, [this.clock.getTime(), amount]),
            this.interestRate);
    }

    withdraw(amount: number) {
        // Throw a warning if withdrawing more than balance?

        if (Math.abs(amount) <= 1e-6) {
            return this;
        }

        return new Bank(
            this.clock,
            new Array<Transaction>(...this.transactions, [this.clock.getTime(), -amount]),
            this.interestRate);
    }

    getTransactions() {
        return this.transactions;
    }

    getBalance() {
        return this.transactions
            .map(([time, amount]) => amount * (1 + this.interestRate) ** (this.clock.getTime() - time))
            .reduce((acc, amount) => acc + amount, 0)
    }

}

class Stock {

    clock: Clock;
    rateOfReturn: number;
    initialPrice: number;
    timeOfPurchase: number;
    numberOfUnits: number;

    constructor(clock: Clock, rateOfReturn: number, initialPrice: number, numberOfUnits: number) {
        this.clock = clock;
        this.rateOfReturn = rateOfReturn;
        this.initialPrice = initialPrice;
        this.timeOfPurchase = clock.getTime();
        this.numberOfUnits = numberOfUnits;
    }

    getNumberOfUnits() {
        return this.numberOfUnits;
    }

    getMonthlyRateOfReturn() {
        return Math.pow(1 + this.rateOfReturn, 1 / 12) - 1;
    }

    getPrice() {
        return this.initialPrice * (1 + this.getMonthlyRateOfReturn()) ** (this.clock.getTime() - this.timeOfPurchase);
    }

    buyUnits(number: number) {
        // throw warning if not integer?
        return new Stock(this.clock, this.rateOfReturn, this.getPrice(), this.numberOfUnits + number);
    }

}

class House {

    clock: Clock;
    downPayment: number;
    loan: number;
    interestRate: number;
    appreciation: number;
    monthlyRentalIncome: number;
    yearRentalIncomeIncrease: number;
    buildingDepreciation: number;
    purchaseTime: number;

    constructor(
        clock: Clock,
        downPayment: number,
        loan: number,
        interestRate: number,
        appreciation: number,
        monthlyRentalIncome: number,
        yearRentalIncomeIncrease: number,
        buildingDepreciation: number) {
        this.clock = clock;
        this.downPayment = downPayment;
        this.loan = loan;
        this.interestRate = interestRate;
        this.appreciation = appreciation;
        this.monthlyRentalIncome = monthlyRentalIncome;
        this.yearRentalIncomeIncrease = yearRentalIncomeIncrease;
        this.buildingDepreciation = buildingDepreciation;
        this.purchaseTime = clock.getTime()
    }

    getMonthlyInterestPayment() {
        return this.loan * this.interestRate / 12.0;
    }

    getMonthlyRentalIncome() {
        return this.monthlyRentalIncome;
    }

    getMonthlyInterestRate() {
        return Math.pow(1 + this.interestRate, 1 / 12) - 1;
    }

    getHouseValue() {
        return (this.downPayment + this.loan) * (1 + this.getMonthlyInterestRate()) ** (this.clock.getTime() - this.purchaseTime);
    }

    getYearlyDepreciation() {
        return this.getHouseValue() * this.buildingDepreciation;
    }

}

let clock = new Clock();
let tax = new Tax(clock, new Array());
let salary = new Salary(clock, 7_300, tax);
let bank = new Bank(clock, new Array(), 0.03);
let house = new House(clock, 50_000, 550_000, 0.03, 0.03, 2_500, 0.03, 0.00);
let stock = new Stock(clock, 0.11, 400, 1);

const waitOneMonth = () => {
    bank = bank
        .deposit(salary.getMonthlyNetSalary())
        .deposit(house.getMonthlyRentalIncome())
        .withdraw(house.getMonthlyInterestPayment())

    const numberOfUnits = Math.floor(bank.getBalance() / stock.getPrice());

    bank = bank
        .withdraw(numberOfUnits * stock.getPrice())

    stock = stock
        .buyUnits(numberOfUnits)

    tax = tax
        .declareIncome(salary.getMonthlyGrossSalary())
        .declareIncome(house.getMonthlyRentalIncome());

    clock.tick()

    console.log('Time:', clock.getTime());
    console.log('Bank transactions:', bank.getTransactions());
    console.log('Bank balance:', bank.getBalance());
    console.log('House value:', house.getHouseValue());
    console.log('Stock price:', stock.getPrice());
    console.log('Stock units:', stock.getNumberOfUnits());
    console.log('Stock value:', stock.getNumberOfUnits() * stock.getPrice());
    console.log('Tax records:', tax.getTaxRecords());

    if (clock.getTime() % 12 === 0) {
        console.log('Tax year end:', tax.getNetTax(clock.getTime(), house.getYearlyDepreciation()));
    }
}

const waitOneYear = () => {
    for (let i = 0; i < 12; i++) {
        waitOneMonth();
    }
}

const waitOneDecade = () => {
    for (let i = 0; i < 10; i++) {
        waitOneYear();
    }
}

// waitOneYear();
waitOneDecade();
waitOneDecade();