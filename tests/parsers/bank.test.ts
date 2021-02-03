import Bank from "../../src/bank";
import parser from "../../src/parsers/bank";

const data = {
  transactions: [[0, 1_000, "Salary"]],
  yearlyInterestRate: 0.03,
};

const bank = new Bank({
  transactions: [[0, 1_000, "Salary"]],
  yearlyInterestRate: 0.03,
});

test("bank object is correctly parsed", () => {
  expect(parser(data)).toEqual(bank);
});
