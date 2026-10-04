// Merge Intervals (LC 56).
//
// Given intervals as [start, end], merge all that overlap and return the
// non-overlapping set. Input is NOT sorted. Touching counts as overlapping
// ([1,4] and [4,5] merge to [1,5]).
//   [[1,3],[2,6],[8,10],[15,18]]  ->  [[1,6],[8,10],[15,18]]
//   [[1,4],[4,5]]                 ->  [[1,5]]
//   []                            ->  []

function merge(intervals: number[][]): number[][] {
  if (intervals.length === 0) return [];
  intervals.sort((a,b) => a[0] - b[0]);
  const merged: number[][] = [intervals[0]];
  for(let i = 1;i < intervals.length;i++) {
    const cur = intervals[i];
    const prev = merged[merged.length - 1];

    if (cur[0] <= prev[1]) {
      merged[merged.length -1] = [prev[0], Math.max(cur[1], prev[1])];
    } else {
      merged.push(cur);
    }
  } 

  return merged;
}

// --- quick test harness ---
const cases: { intervals: number[][]; expected: number[][] }[] = [
  { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]], expected: [[1, 6], [8, 10], [15, 18]] },
  { intervals: [[1, 4], [4, 5]], expected: [[1, 5]] },
  { intervals: [], expected: [] },
  { intervals: [[1, 4], [2, 3]], expected: [[1, 4]] },
  { intervals: [[1, 4], [0, 4]], expected: [[0, 4]] },
  { intervals: [[1, 4], [5, 6]], expected: [[1, 4], [5, 6]] },
  { intervals: [[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]], expected: [[1, 10]] },
  { intervals: [[1, 1]], expected: [[1, 1]] },
  { intervals: [[5, 6], [1, 3], [2, 4]], expected: [[1, 4], [5, 6]] },
];

cases.forEach(({ intervals, expected }) => {
  const actual = merge(intervals.map((p) => [...p]));
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? '✓' : '✗'} merge(${JSON.stringify(intervals)}) = ${JSON.stringify(actual)} (exp ${JSON.stringify(expected)})`);
});
