import State from "../state";
import Stock from "../stock";
import House from "../house";


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
        return this.state.getClock().getTime() === 120;
    }

    render() {
        return {
            'Time': this.state.getClock().getTime(),
            'Salary': this.state.getSalary().getYearlyGrossSalary(this.state.getClock().getTime()),
            'Bank balance:': this.state.getBank().getBalance(this.state.getClock().getTime()),
            'Super balance:': this.state.getSuper().getBalance(this.state.getClock().getTime()),
            'Stock balance:': this.state.getStocks().reduce((acc, stock) => acc + stock.getNumberOfUnits() * stock.getPrice(this.state.getClock().getTime()), 0),
            'Total net worth': this.state.getNetWealth(),
        }
    }

    step(action: Action): Environment {
        let newState = this.state;

        switch (action) {
            case Action.BuyHouse:
                newState = this.state.buyHouse(
                    new House({
                        loan: 550_000,
                        houseValue: 600_000,
                        interestRate: 0.03,
                        yearlyAppreciationRate: 0.03,
                        monthlyRentalIncome: 2500,
                        yearlyRentalIncomeIncrease: 0.03,
                        buildingDepreciationRate: 0.02,
                        purchaseTime: 0
                    }));
                break;
            case Action.BuyStock:
                newState = this.state.buyStock(
                    new Stock({
                        rateOfReturn: 0.1,
                        initialTime: 0,
                        initialPrice: 500,
                        transactions: [[0, 100]],
                    }));
                break;
            case Action.NoOp:
                break;
            default:
                console.error('Action', action, 'not understood. Ignoring action.');
        }

        if (newState.isValid()) {
            this.state = newState;
        }

        this.state = this.state.waitOneMonth();

        return this;
    }

}

export { Environment, Action };