// Rotting Oranges.
//
// Grid values: 0 = empty, 1 = fresh, 2 = rotten. Each minute, every rotten
// orange rots its up/down/left/right fresh neighbors simultaneously. Return the
// number of minutes until no fresh orange remains, or -1 if some fresh orange
// can never rot. Return 0 if there were no fresh oranges to begin with.
//
// Decode (fill these in before you write the body):
//   Q1 node  =
//   Q2 edge  =
//   Q3 wrap  =

type Cell = [number, number];

const directions: Cell[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function orangesRotting(grid: number[][]): number {

}

// --- quick test harness ---
const cases: [number[][], number][] = [
  [
    [
      [2, 1, 1],
      [1, 1, 0],
      [0, 1, 1],
    ],
    4,
  ],
  [
    // bottom-left fresh orange is walled off
    [
      [2, 1, 1],
      [0, 1, 1],
      [1, 0, 1],
    ],
    -1,
  ],
  [[[0, 2]], 0], // no fresh oranges
  [
    [
      [2, 1, 2],
      [1, 1, 1],
    ],
    2,
  ],
  [[[2, 1, 1, 1, 1]], 4], // rot spreads right, one column per minute
];
for (const [grid, exp] of cases) {
  const input = JSON.stringify(grid);
  const got = orangesRotting(grid);
  console.log(`${got === exp ? "✓" : "✗"} orangesRotting(${input}) = ${got} (exp ${exp})`);
}
