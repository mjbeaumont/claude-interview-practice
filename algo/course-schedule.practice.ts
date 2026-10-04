// Course Schedule.
//
// There are numCourses courses labeled 0..numCourses-1. prerequisites[i] =
// [a, b] means: to take course a you must first take course b. Return true if
// you can finish all courses, false otherwise.
//
// Decode (fill these in before you write the body):
//   Q1 node  =
//   Q2 edge  =
//   Q3 wrap  =

function canFinish(numCourses: number, prerequisites: number[][]): boolean {

}

// --- quick test harness ---
const cases: [number, number[][], boolean][] = [
  [2, [[1, 0]], true],                                // 0 -> 1, no cycle
  [2, [[1, 0], [0, 1]], false],                       // 0 <-> 1 cycle
  [4, [[1, 0], [2, 1], [3, 2]], true],                // chain
  [3, [[0, 1], [1, 2], [2, 0]], false],               // 3-cycle
  [5, [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3]], true], // diamond+
  [1, [], true],                                      // no prereqs
];
for (const [n, prereqs, exp] of cases) {
  const got = canFinish(n, prereqs);
  console.log(`${got === exp ? "✓" : "✗"} canFinish(${n}, ${JSON.stringify(prereqs)}) = ${got} (exp ${exp})`);
}
