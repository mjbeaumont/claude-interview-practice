// In the real problem `isBadVersion` is given. Here we build one per test.
function makeSolution(firstBad: number) {
  const isBadVersion = (v: number): boolean => v >= firstBad;

  function firstBadVersion(n: number): number {
    let lo = 1;
    let hi = n;

    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (isBadVersion(mid)) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }

    return hi;
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
