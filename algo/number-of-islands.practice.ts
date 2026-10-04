// Number of Islands.
//
// Given a grid of '1' (land) and '0' (water) as STRINGS, count the number of
// islands. An island is land connected up/down/left/right; the grid edges are
// surrounded by water.
//
// Decode (fill these in before you write the body):
//   Q1 node  =
//   Q2 edge  =
//   Q3 wrap  =

type Position = [number, number];

const directions: Position[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function numIslands(grid: string[][]): number {

}


// --- quick test harness ---
const cases: [string[][], number][] = [
  [
    [
      ['1', '1', '0', '0', '0'],
      ['1', '1', '0', '0', '0'],
      ['0', '0', '1', '0', '0'],
      ['0', '0', '0', '1', '1'],
    ],
    3,
  ],
  [
    [
      ['1', '1', '1', '1', '0'],
      ['1', '1', '0', '1', '0'],
      ['1', '1', '0', '0', '0'],
      ['0', '0', '0', '0', '0'],
    ],
    1,
  ],
];
for (const [grid, exp] of cases) {
  const input = JSON.stringify(grid);
  const got = numIslands(grid);
  console.log(`${got === exp ? "✓" : "✗"} numIslands(${input}) = ${got} (exp ${exp})`);
}
