import parser from "../../src/parsers/history";

const data = {
  history: [
    {
      clock: {
        time: 0,
      },
      tax: {
        incomeTaxBrackets: [
          [[0, 18200], 0],
          [[18201, 37000], 0.19],
          [[37001, 87000], 0.325],
          [[87001, 180000], 0.37],
          [[180001, null], 0.45],
        ],
        superTaxRate: 0.15,
        declared: [],
        paid: [],
      },
      bank: {
        transactions: [],
        yearlyInterestRate: 0.045,
        initialBalance: "10",
      },
      superan: {
        tax: {
          incomeTaxBrackets: [
            [[0, 18200], 0],
            [[18201, 37000], 0.19],
            [[37001, 87000], 0.325],
            [[87001, 180000], 0.37],
            [[180001, null], 0.45],
          ],
          superTaxRate: 0.15,
          declared: [],
          paid: [],
        },
        transactions: [],
        yearlyInterestRate: 0.1,
        contributionRate: 0.125,
      },
      salary: {
        yearlyGrossSalary: 160000,
        yearlySalaryIncrease: 0.05,
        tax: {
          incomeTaxBrackets: [
            [[0, 18200], 0],
            [[18201, 37000], 0.19],
            [[37001, 87000], 0.325],
            [[87001, 180000], 0.37],
            [[180001, null], 0.45],
          ],
          superTaxRate: 0.15,
          declared: [],
          paid: [],
        },
        creationTime: 0,
      },
      houses: {},
      stocks: {},
      expenses: {},
    },
  ],
  events: [[]],
};

test("history object is correctly parsed", () => {
  // expect(parser(data)).toEqual(0);
});
