// House Robber.
//
// You're robbing houses on a street; each house i holds nums[i] dollars.
// Adjacent houses have a connected alarm system — if you rob two houses that
// are adjacent, the alarm goes off. Return the max amount you can rob without
// robbing two adjacent houses.
//   [1,2,3,1]     -> 4   (rob house 0 and house 2: 1+3)
//   [2,7,9,3,1]   -> 12  (rob house 0, 2, and 4: 2+9+1)

function rob(nums: number[]): number {

}

// ---- test harness ----
const robCases: [number[], number][] = [
  [[1, 2, 3, 1], 4],
  [[2, 7, 9, 3, 1], 12],
  [[2, 1, 1, 2], 4],
  [[5, 3], 5],
  [[5], 5],
  [[], 0],
];
for (const [nums, exp] of robCases) {
  const got = rob(nums);
  const pass = got === exp;
  console.log(`${pass ? "✓" : "✗"} rob(${JSON.stringify(nums)}) = ${got} (exp ${exp})`);
}
