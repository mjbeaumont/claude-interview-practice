// 0/1 Knapsack.
//
// Given item weights, their values, and a bag capacity, return the maximum
// total value you can carry. Each item may be taken at most once, whole only.
//   weights = [1,3,4,5], values = [1,4,5,7], capacity = 7  -> 9   (items 3+4)
//   weights = [10],      values = [100],     capacity = 5  -> 0   (doesn't fit)
//
// weights and values are the same length and index-aligned.

function knapsack(weights: number[], values: number[], capacity: number): number {
  // Returns the max value obtainable from the first n items (indices 0..n-1)
  // with `remaining` capacity left in the bag.
  const memo = Array.from({ length: weights.length + 1 }, () => new Array(capacity + 1).fill(-1));

  function solve(n: number, remaining: number): number {
    if (n === 0 || remaining === 0) {
      return 0;
    }

    if(memo[n][remaining] !== -1) {
      return memo[n][remaining];
    }

    let max: number;

    if (weights[n - 1] <= remaining) {
      max = Math.max(
        values[n-1] + solve(n-1, remaining - weights[n-1]),
        solve(n-1, remaining),
      );
    } else {
      max = solve(n-1, remaining);
    }

    memo[n][remaining] = max;
    return max;
  }

  return solve(weights.length, capacity);
}

// ---- test harness ----
const knapsackCases: [number[], number[], number, number][] = [
  [[1, 3, 4, 5], [1, 4, 5, 7], 7, 9],
  [[10, 20, 30], [60, 100, 120], 50, 220],
  [[10], [100], 5, 0],
  [[1, 2], [5, 6], 10, 11],
  [[1, 3, 4, 5], [1, 4, 5, 7], 0, 0],
  [[], [], 10, 0],
];
for (const [weights, values, capacity, exp] of knapsackCases) {
  const got = knapsack(weights, values, capacity);
  const pass = got === exp;
  console.log(
    `${pass ? "✓" : "✗"} knapsack(${JSON.stringify(weights)}, ${JSON.stringify(values)}, ${capacity}) = ${got} (exp ${exp})`,
  );
}
