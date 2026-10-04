// Coin Change.
//
// You have coins of given denominations and want to make up a given amount.
// Return the fewest number of coins needed. If it's not possible, return -1.
//   coins = [1,2,5], amount = 11  -> 3   (5+5+1)
//   coins = [2],     amount = 3   -> -1  (can't make 3 with only 2s)
//   coins = [1],     amount = 0   -> 0

function coinChange(coins: number[], amount: number): number {

}

// ---- test harness ----
const coinChangeCases: [number[], number, number][] = [
  [[1, 2, 5], 11, 3],
  [[2], 3, -1],
  [[1], 0, 0],
  [[1], 1, 1],
  [[1], 2, 2],
  [[2, 5, 10], 27, 4],
];
for (const [coins, amount, exp] of coinChangeCases) {
  const got = coinChange(coins, amount);
  const pass = got === exp;
  console.log(`${pass ? "✓" : "✗"} coinChange(${JSON.stringify(coins)}, ${amount}) = ${got} (exp ${exp})`);
}
