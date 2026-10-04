// First Bad Version.
//
// Versions 1..n were released in order. After some version, every later version
// is also bad (once it breaks, it stays broken). You have an API
// isBadVersion(v): boolean. Find the first bad version while minimizing calls.

// In the real problem `isBadVersion` is given. Here we build one per test.
function makeSolution(firstBad: number) {
  const isBadVersion = (v: number): boolean => v >= firstBad;

  function firstBadVersion(n: number): number {

  }

  return firstBadVersion;
}

// ---- test harness ----
const cases: [number, number][] = [
  // [n, firstBad]
  [5, 4],
  [1, 1],
  [10, 1],
  [10, 10],
  [100, 57],
];
for (const [n, firstBad] of cases) {
  const got = makeSolution(firstBad)(n);
  console.log(`${got === firstBad ? "✓" : "✗"} n=${n}, firstBad=${firstBad} → got ${got}`);
}
