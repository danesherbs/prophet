import Bank from "../../src/bank";
import parser from "../../src/parsers/bank";

const bank = new Bank({
  transactions: [[0, 1_000, "Salary"]],
  yearlyInterestRate: 0.03,
});

const data = JSON.parse(JSON.stringify(bank));

test("bank object is correctly parsed", () => {
  expect(parser(data)).toStrictEqual(bank);
});
