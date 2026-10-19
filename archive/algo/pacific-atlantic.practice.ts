// Pacific Atlantic Water Flow.
//
// Given an m x n grid of heights, water flows from a cell to an
// up/down/left/right neighbor if that neighbor's height is <= the current
// cell's height. The Pacific ocean touches the top row and left column; the
// Atlantic touches the bottom row and right column. Return the coordinates of
// every cell from which water can flow to BOTH oceans.
//
// Decode (fill these in before you write the body):
//   Q1 node  =
//   Q2 edge  =
//   Q3 wrap  =

function pacificAtlantic(heights: number[][]): number[][] {

}

// --- quick test harness ---
const grid = [
  [1, 2, 2, 3, 5],
  [3, 2, 3, 4, 4],
  [2, 4, 5, 3, 1],
  [6, 7, 1, 4, 5],
  [5, 1, 1, 2, 4],
];
const exp = [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]];

// Cells can come back in any order, so compare sorted.
const sortCells = (cells: number[][]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
const got = sortCells(pacificAtlantic(grid) ?? []);
const pass = JSON.stringify(got) === JSON.stringify(exp);
console.log(`${pass ? "✓" : "✗"} pacificAtlantic(grid) = ${JSON.stringify(got)} (exp ${JSON.stringify(exp)})`);
