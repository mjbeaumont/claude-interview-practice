// Product of Array Except Self (LC 238).
//
// Given an integer array nums, return an array answer where answer[i] is the
// product of every element of nums except nums[i]. Do not use division. The
// algorithm must run in O(n) time.
//   [1,2,3,4]     -> [24,12,8,6]
//   [-1,1,0,-3,3] -> [0,0,9,0,0]
// Constraints: 2 <= nums.length <= 100000, -30 <= nums[i] <= 30. Every prefix and
// suffix product fits in a 32-bit integer.

function productExceptSelf(nums: number[]): number[] {

}

// --- quick test harness ---
const cases: [number[], number[]][] = [
  [[1, 2, 3, 4], [24, 12, 8, 6]],
  [[-1, 1, 0, -3, 3], [0, 0, 9, 0, 0]],
  [[2, 3], [3, 2]],
  [[0, 0], [0, 0]],
  [[0, 4], [4, 0]],
  [[5, 0, 2], [0, 10, 0]],
  [[-2, 3], [3, -2]],
  [[1, 1, 1, 1], [1, 1, 1, 1]],
  [[-1, -2, -3], [6, 3, 2]],
];
for (const [input, exp] of cases) {
  const got = productExceptSelf([...input]);
  const pass = Array.isArray(got) && got.length === exp.length && got.every((v, i) => v === exp[i]);
  console.log(`${pass ? "✓" : "✗"} productExceptSelf(${JSON.stringify(input)}) = ${JSON.stringify(got)} (exp ${JSON.stringify(exp)})`);
}
