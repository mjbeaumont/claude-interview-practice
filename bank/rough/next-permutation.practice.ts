// Next Permutation (LC 31).
//
// Rearrange nums, in place, into the next larger arrangement in dictionary order,
// the smallest arrangement that is greater than the current one. If the current
// arrangement is already the largest, rearrange it into the smallest one.
// Use only constant extra memory.
//   [1,2,3] -> [1,3,2]
//   [3,2,1] -> [1,2,3]
//   [1,1,5] -> [1,5,1]
// Constraints: 1 <= nums.length <= 100, 0 <= nums[i] <= 100.

function nextPermutation(nums: number[]): void {

}

// --- quick test harness ---
const cases: [number[], number[]][] = [
  [[1, 2, 3], [1, 3, 2]],
  [[3, 2, 1], [1, 2, 3]],
  [[1, 1, 5], [1, 5, 1]],
  [[1, 3, 2], [2, 1, 3]],
  [[2, 3, 1], [3, 1, 2]],
  [[1, 5, 1], [5, 1, 1]],
  [[2, 2, 2], [2, 2, 2]],
  [[0, 1], [1, 0]],
  [[1, 2, 3, 6, 5, 4], [1, 2, 4, 3, 5, 6]],
];
for (const [input, exp] of cases) {
  const arr = [...input];
  const ret = nextPermutation(arr);
  const pass = ret === undefined && JSON.stringify(arr) === JSON.stringify(exp);
  console.log(`${pass ? "✓" : "✗"} nextPermutation(${JSON.stringify(input)}) = ${JSON.stringify(arr)} (exp ${JSON.stringify(exp)})`);
}
