export const toMonthlyRate = (yearlyRate: number) => {
  /*
  Solves  `(1 + r) ^ 12 = 1 + R`  for r given R.
  */
  return Math.pow(1 + yearlyRate, 1 / 12) - 1;
};

export const toWeeklyRate = (yearlyRate: number) => {
  /*
  Solves  `(1 + r) ^ 52 = 1 + R`  for r given R.
  */
  return Math.pow(1 + yearlyRate, 1 / 52) - 1;
};
