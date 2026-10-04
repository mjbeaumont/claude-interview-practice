// 0/1 Knapsack.
//
// Given item weights, their values, and a bag capacity, return the maximum
// total value you can carry. Each item may be taken at most once, whole only.
//   weights = [1,3,4,5], values = [1,4,5,7], capacity = 7  -> 9   (items 3+4)
//   weights = [10],      values = [100],     capacity = 5  -> 0   (doesn't fit)
//
// weights and values are the same length and index-aligned.

function knapsack(weights: number[], values: number[], capacity: number): number {

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
