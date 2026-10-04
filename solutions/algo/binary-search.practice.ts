// Binary search (classic).
//
// Given a sorted ascending array `list` and a `target`, return the index of
// target, or -1 if it is not present.

function binarySearch(list: number[], target: number): number {
  let lo = 0;
  let hi = list.length - 1;

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const val = list[mid];
    if (val === target) {
      return mid;
    }

    if (target > val) {
      lo = mid + 1;
    } else if (target < val) {
      hi = mid - 1;
    }
  }

  return -1;
}

// ---- test harness ----
const searchCases: [number[], number, number][] = [
  [[1, 3, 5, 7, 9], 1, 0],
  [[1, 3, 5, 7, 9], 9, 4],
  [[1, 3, 5, 7, 9], 5, 2],
  [[1, 3, 5, 7, 9], 2, -1],
  [[1, 3, 5, 7, 9], 10, -1],
  [[], 5, -1],
  [[42], 42, 0],
];
for (const [list, target, exp] of searchCases) {
  const got = binarySearch(list, target);
  console.log(`${got === exp ? "✓" : "✗"} binarySearch(${JSON.stringify(list)}, ${target}) = ${got} (exp ${exp})`);
}
