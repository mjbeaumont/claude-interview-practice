// 3Sum (LC 15).
//
// Given an integer array nums, return all unique triplets [a, b, c] (from
// distinct indices) with a + b + c === 0. The result must not contain
// duplicate triplets. Order of triplets, and of values within one, is free.
//   [-1,0,1,2,-1,-4]  ->  [[-1,-1,2],[-1,0,1]]
//   [0,1,1]           ->  []
//   [0,0,0]           ->  [[0,0,0]]
// Constraints: 3 <= nums.length <= 3000.

function threeSum(nums: number[]): number[][] {

}

// --- quick test harness ---
const normalize = (triplets: number[][]): string =>
  JSON.stringify(triplets.map((t) => [...t].sort((a, b) => a - b)).sort((a, b) => {
    for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i];
    return 0;
  }));

const cases: { nums: number[]; expected: number[][] }[] = [
  { nums: [-1, 0, 1, 2, -1, -4], expected: [[-1, -1, 2], [-1, 0, 1]] },
  { nums: [0, 1, 1], expected: [] },
  { nums: [0, 0, 0], expected: [[0, 0, 0]] },
  { nums: [0, 0, 0, 0], expected: [[0, 0, 0]] },
  { nums: [-2, 0, 1, 1, 2], expected: [[-2, 0, 2], [-2, 1, 1]] },
  { nums: [1, 2, -2, -1], expected: [] },
  { nums: [-1, -1, -1, 2], expected: [[-1, -1, 2]] },
  { nums: [3, 0, -2, -1, 1, 2], expected: [[-2, -1, 3], [-2, 0, 2], [-1, 0, 1]] },
];

cases.forEach(({ nums, expected }) => {
  const actual = threeSum([...nums]);
  const pass = Array.isArray(actual) && normalize(actual) === normalize(expected);
  console.log(`${pass ? '✓' : '✗'} threeSum(${JSON.stringify(nums)}) = ${JSON.stringify(actual)} (exp ${JSON.stringify(expected)})`);
});
