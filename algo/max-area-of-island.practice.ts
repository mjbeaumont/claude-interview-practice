// Max Area of Island.
//
// Given a grid of 1 (land) and 0 (water), return the size of the largest
// island. An island is a group of land cells connected up/down/left/right
// (not diagonally); its size is the number of cells in it. If there is no
// land, return 0. The grid has at least one row and one column.
//   [[1,1,0],
//    [1,0,0],
//    [0,0,1]]   -> 3
//   [[0,0],
//    [0,0]]     -> 0
//   [[1]]       -> 1

function maxAreaOfIsland(grid: number[][]): number {

}

// --- quick test harness ---
const cases: { grid: number[][]; expected: number }[] = [
  {
    grid: [
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1],
    ],
    expected: 4,
  },
  {
    grid: [
      [1, 1, 1, 1, 0],
      [1, 1, 0, 1, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    expected: 9,
  },
  {
    grid: [
      [0, 0],
      [0, 0],
    ],
    expected: 0,
  },
  {
    grid: [[1]],
    expected: 1,
  },
  {
    grid: [
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1],
    ],
    expected: 1,
  },
  {
    grid: [
      [0, 1, 1, 0],
      [1, 1, 0, 1],
      [0, 1, 1, 1],
      [1, 0, 0, 1],
    ],
    expected: 9,
  },
];

cases.forEach(({ grid, expected }) => {
  const input = JSON.stringify(grid);
  const actual = maxAreaOfIsland(grid);
  const pass = actual === expected;
  console.log(`${pass ? '✓' : '✗'} maxAreaOfIsland(${input}) = ${actual} (exp ${expected})`);
});
