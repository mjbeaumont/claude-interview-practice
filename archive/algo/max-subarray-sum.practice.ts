// Maximum Subarray Sum.
//
// Given an integer array nums, find the contiguous subarray (containing at
// least one number) which has the largest sum, and return that sum.
//   [-2,1,-3,4,-1,2,1,-5,4]  -> 6   (subarray [4,-1,2,1])
//   [5,4,-1,7,8]             -> 23  (whole array)
//   [-1]                     -> -1

function maxSubArray(nums: number[]): number {

}

// ---- test harness ----
const maxSubArrayCases: [number[], number][] = [
  [[-2, 1, -3, 4, -1, 2, 1, -5, 4], 6],
  [[1], 1],
  [[5, 4, -1, 7, 8], 23],
  [[-1], -1],
  [[-2, -1], -1],
];
for (const [nums, exp] of maxSubArrayCases) {
  const got = maxSubArray(nums);
  const pass = got === exp;
  console.log(`${pass ? "✓" : "✗"} maxSubArray(${JSON.stringify(nums)}) = ${got} (exp ${exp})`);
}
