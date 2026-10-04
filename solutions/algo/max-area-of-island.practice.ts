// Given a grid of 1 (land) and 0 (water), return the size of the largest island.
// An island is land connected up/down/left/right. Size is the count of its cells.

// Always mark the node visited, recurse into any valid neighbors, and return the collected state + the weight of the current node.
// The things that vary: how you collect the state (max, min, sum) for each individual flood, what value the current node contributes, and how to aggregate all of the floods 

type Position = [number, number];
const directions: Position[] = [[0,1],[1,0],[0,-1],[-1,0]];

function maxAreaOfIsland(grid: number[][]): number {
  let largest: number = 0;
  const rows = grid.length;
  const cols = grid[0].length;

  function flood([row, col]: Position): number {

    grid[row][col] = 0;

    let numCells: number = 0;

    for(let [dirRow, dirCol] of directions) {
      const [newRow, newCol] = [dirRow + row, dirCol + col];

      if (newRow < 0 || newCol < 0 || newRow >= rows || newCol >= cols) {
        continue; 
      }

      if (grid[newRow][newCol] === 0) {
        continue;
      }

      numCells += flood([newRow, newCol]);
    }

    return numCells + 1;
  }

  for(let row = 0;row < rows;row++) {
    for(let col = 0;col < cols;col++) {
      if (grid[row][col] === 1) {
        const cells = flood([row, col]);
        largest = Math.max(cells, largest);
      }
    }
  }

  return largest;
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
