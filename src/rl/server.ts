import { Environment, Action } from "./environment";
import State from "../state";
import Clock from "../clock";
import Tax from "../tax";
import Bank from "../bank";
import Super from "../super";
import Salary from "../salary";
import * as zmq from "zeromq";

const reset = (): Environment => {
  const clock = new Clock(0);

  const tax = new Tax({
    incomeTaxBrackets: new Array(
      [[0.0, 18_200], 0.0],
      [[18_201, 37_000], 0.19],
      [[37_001, 87_000], 0.325],
      [[87_001, 180_000], 0.37],
      [[180_001, Infinity], 0.45]
    ),
    superTaxRate: 0.15,
    declared: new Array(),
    paid: new Array(),
  });

  const bank = new Bank({
    transactions: new Array(),
    yearlyInterestRate: 0.03,
  });

  const superan = new Super({
    tax: tax,
    transactions: new Array(),
    yearlyInterestRate: 0.1,
    contributionRate: 0.125,
  });

  const salary = new Salary({
    tax: tax,
    yearlyGrossSalary: 120_000,
    yearlySalaryIncrease: 0.05,
  });

  const state = new State({
    clock: clock,
    tax: new Map([["tax", tax]]),
    banks: new Map([["bank", bank]]),
    superans: new Map([["super", superan]]),
    salaries: new Map([["salary", salary]]),
    houses: new Map(),
    stocks: new Map(),
    expenses: new Map(),
  });

  return new Environment(state);
};

interface Response {
  type: string;
  data: string;
}

async function runServer() {
  const sock = new zmq.Reply();

  await sock.bind("tcp://*:5555");

  let message: Response;
  let action: Action;
  let env = reset();

  for await (const [msg] of sock) {
    message = JSON.parse(msg.toString()) as Response;

    if (message["type"] === "function" && message["data"] === "reset") {
      env = reset();
      await sock.send(JSON.stringify({ obs: env.getObservation() }));
    } else if (
      message["type"] === "function" &&
      message["data"] === "obs_space"
    ) {
      await sock.send(JSON.stringify({ obs_space: env.getStateSpace() }));
    } else if (
      message["type"] === "function" &&
      message["data"] === "action_space"
    ) {
      await sock.send(JSON.stringify({ action_space: env.getActionSpace() }));
    } else if (message["type"] === "function" && message["data"] === "render") {
      await sock.send(JSON.stringify({ render: env.render() }));
    } else if (message["type"] === "function" && message["data"] === "quit") {
      break;
    } else if (message["type"] === "action") {
      action = parseInt(message["data"]) as Action;
      env = env.step(action);
      await sock.send(
        JSON.stringify({
          obs: env.getObservation(),
          reward: env.getReward(),
          done: env.isDone(),
          info: env.getInfo(),
        })
      );
    } else {
      console.error("Server received didn't understand", message);
    }
  }
}

runServer();
