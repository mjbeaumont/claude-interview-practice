// Longest Increasing Subsequence (LC 300).
//
// Given an integer array nums, return the length of the longest strictly
// increasing subsequence. A subsequence keeps the original order but may skip
// elements. An empty array has length 0.
//   [10,9,2,5,3,7,101,18]  -> 4   ([2,3,7,101])
//   [0,1,0,3,2,3]          -> 4   ([0,1,2,3])
//   [7,7,7,7]              -> 1   (equal values don't count as increasing)

function lengthOfLIS(nums: number[]): number {

}

// ---- test harness ----
const lengthOfLISCases: [number[], number][] = [
  [[10, 9, 2, 5, 3, 7, 101, 18], 4],
  [[0, 1, 0, 3, 2, 3], 4],
  [[7, 7, 7, 7, 7, 7, 7], 1],
  [[], 0],
  [[5], 1],
  [[1, 2, 3, 4, 5], 5],
  [[5, 4, 3, 2, 1], 1],
];
for (const [nums, exp] of lengthOfLISCases) {
  const got = lengthOfLIS(nums);
  const pass = got === exp;
  console.log(`${pass ? "✓" : "✗"} lengthOfLIS(${JSON.stringify(nums)}) = ${got} (exp ${exp})`);
}
