// Subarray Sum Equals K.
//
// Given an integer array nums and an integer k, return the number of
// contiguous subarrays whose sum equals k. Array may contain negatives.
//   nums = [1,1,1], k = 2      -> 2
//   nums = [1,2,3], k = 3      -> 2
//   nums = [1,-1,0], k = 0     -> 3

function subarraySum(nums: number[], k: number): number {

}

// ---- test harness ----
const subarraySumCases: [number[], number, number][] = [
  [[1, 1, 1], 2, 2],
  [[1, 2, 3], 3, 2],
  [[1, -1, 0], 0, 3],
  [[1], 0, 0],
  [[0, 0, 0], 0, 6],
];
for (const [nums, k, exp] of subarraySumCases) {
  const got = subarraySum(nums, k);
  const pass = got === exp;
  console.log(`${pass ? "✓" : "✗"} subarraySum(${JSON.stringify(nums)}, ${k}) = ${got} (exp ${exp})`);
}
