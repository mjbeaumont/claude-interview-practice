// Last index ≤ target.
//
// Given a sorted ascending array `list` and a `target`, return the index of
// the LARGEST element that is still ≤ target. If every element is greater than
// target (no such element exists), return -1.
//
// Examples:
//   [1, 3, 5, 7, 9], 6  -> 2   (5 is the largest ≤ 6)
//   [1, 3, 5, 7, 9], 5  -> 2   (exact hits count)
//   [1, 3, 5, 7, 9], 9  -> 4
//   [1, 3, 5, 7, 9], 0  -> -1  (nothing is ≤ 0)

function lastIndexLeq(list: number[], target: number): number {

}

// ---- test harness ----
const cases: [number[], number, number][] = [
  [[1, 3, 5, 7, 9], 6, 2],
  [[1, 3, 5, 7, 9], 5, 2],
  [[1, 3, 5, 7, 9], 9, 4],
  [[1, 3, 5, 7, 9], 0, -1],
  [[1, 3, 5, 7, 9], 100, 4],
  [[], 5, -1],
  [[42], 42, 0],
  [[42], 1, -1],
];
for (const [list, target, exp] of cases) {
  const got = lastIndexLeq(list, target);
  console.log(`${got === exp ? "✓" : "✗"} lastIndexLeq(${JSON.stringify(list)}, ${target}) = ${got} (exp ${exp})`);
}
