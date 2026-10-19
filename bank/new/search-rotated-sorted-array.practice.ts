// Search in Rotated Sorted Array (LC 33).
//
// An ascending array of distinct integers was rotated at an unknown pivot
// (e.g. [0,1,2,4,5,6,7] became [4,5,6,7,0,1,2]). Return the index of target,
// or -1 if absent. Must run in O(log n).
//   [4,5,6,7,0,1,2], 0  ->  4
//   [4,5,6,7,0,1,2], 3  ->  -1
//   [1], 0              ->  -1
// Constraints: 1 <= nums.length <= 5000, all values distinct.

function search(nums: number[], target: number): number {

}

// --- quick test harness ---
const cases: { nums: number[]; target: number; expected: number }[] = [
  { nums: [4, 5, 6, 7, 0, 1, 2], target: 0, expected: 4 },
  { nums: [4, 5, 6, 7, 0, 1, 2], target: 3, expected: -1 },
  { nums: [1], target: 0, expected: -1 },
  { nums: [1], target: 1, expected: 0 },
  { nums: [3, 1], target: 1, expected: 1 },
  { nums: [5, 1, 3], target: 5, expected: 0 },
  { nums: [1, 3], target: 3, expected: 1 },
  { nums: [6, 7, 0, 1, 2, 4, 5], target: 6, expected: 0 },
  { nums: [2, 3, 4, 5, 1], target: 1, expected: 4 },
  { nums: [0, 1, 2, 4, 5, 6, 7], target: 7, expected: 6 },
];

cases.forEach(({ nums, target, expected }) => {
  const actual = search([...nums], target);
  const pass = actual === expected;
  console.log(`${pass ? '✓' : '✗'} search(${JSON.stringify(nums)}, ${target}) = ${actual} (exp ${expected})`);
});
