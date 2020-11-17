import { State } from "../state";
import { Stock } from "../stock";
import { House } from "../house";
import { Salary } from "../salary";
import { Super } from "../super";
import { Bank } from "../bank";
import { Tax } from "../tax";
import { Clock } from "../clock";


enum Action {
    BuyHouse,
    BuyStock,
}

class Environment {

    state: State;

    constructor(state: State) {
        this.state = state;
    }

    getReward() {
        return this.state.getNetWealth();
    }

    getState() {
        return this.state;
    }

    getObservation() {
        return new Array();
    }

    getStateSpace() {
        return new Array();
    }

    getActionSpace() {

        // TODO: figure out what to do if some actions are illegal in current state?

        return [
            Action.BuyHouse,
            Action.BuyStock,
        ]
    }

    getInfo() {
        return {};
    }

    isDone() {
        return false;
    }

    reset() {
        const clock = new Clock(0);

        const tax = new Tax({
            incomeTaxBrackets: new Array(),
            superTaxRate: 0.15,
            declared: new Array(),
            paid: new Array()
        });

        const bank = new Bank({
            transactions: new Array(),
            interestRate: 0.03
        });

        const superan = new Super({
            tax: tax,
            transactions: new Array(),
            interestRate: 0.1,
            contributionRate: 0.125,
        });

        const salary = new Salary({
            tax: tax,
            yearlyGrossSalary: 120_000,
            yearlySalaryIncrease: 0.05,
            creationTime: clock.getTime()
        });

        const state = new State({
            clock: clock,
            tax: tax,
            bank: bank,
            superan: superan,
            salary: salary,
            houses: new Array(),
            stocks: new Array(),
            expenses: new Array(),
        });

        return new Environment(state);
    }

    step(action: Action): Environment {
        switch (action) {
            case Action.BuyHouse:
                return new Environment(
                    this.state.buyHouse(
                        new House({
                            tax: this.state.getTax(),
                            downPayment: 50_000,
                            loan: 550_000,
                            interestRate: 0.03,
                            appreciation: 0.03,
                            monthlyRentalIncome: 2500,
                            yearlyRentalIncomeIncrease: 0.03,
                            buildingDepreciation: 0.02,
                            purchaseTime: 0
                        })));
            case Action.BuyStock:
                return new Environment(
                    this.state.buyStock(
                        new Stock({
                            rateOfReturn: 0.1,
                            initialTime: 0,
                            initialPrice: 500,
                            transactions: [[0, 100]],
                        })));
            default:
                return this;
        }

    }

}

export { Environment, Action };