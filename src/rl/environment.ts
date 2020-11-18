import { State } from "../state";
import { Stock } from "../stock";
import { House } from "../house";
import { Salary } from "../salary";
import { Super } from "../super";
import { Bank } from "../bank";
import { Tax } from "../tax";
import { Clock } from "../clock";


enum Action {
    NoOp,
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
        return [
            this.state.getBank().getBalance(this.state.getClock().getTime()),
        ];
    }

    getStateSpace() {
        return this.getObservation().length;
    }

    getActionSpace() {

        // TODO: figure out what to do if some actions are illegal in current state?
        // TODO: count enums in robust way

        return Object.values(Action).length / 2;
    }

    getInfo() {
        return { time: this.state.getClock().getTime() };
    }

    isDone() {
        return this.state.getClock().getTime() === 12;
    }

    step(action: Action): Environment {
        let newState = this.state;

        switch (action) {
            case Action.BuyHouse:
                newState = this.state.buyHouse(
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
                    })).waitOneMonth();
                break;
            case Action.BuyStock:
                newState = this.state.buyStock(
                    new Stock({
                        rateOfReturn: 0.1,
                        initialTime: 0,
                        initialPrice: 500,
                        transactions: [[0, 100]],
                    })).waitOneMonth();
                break;
            case Action.NoOp:
                newState = this.state.waitOneMonth();
                break;
            default:
                console.error('Action', action, 'not understood. Ignoring action.');
        }

        if (newState.isLegal()) {
            this.state = newState;
        }

        this.state = this.state.waitOneMonth();

        return this;
    }

}

export { Environment, Action };