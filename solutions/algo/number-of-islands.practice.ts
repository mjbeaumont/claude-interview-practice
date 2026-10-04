// Number of Islands — practice (recursive DFS)
//
// Grid of '1' (land) and '0' (water), as STRINGS.
// Count islands. An island = land connected up/down/left/right.
//
// Decode:
//   Q1 node  = a grid cell (r, c)
//   Q2 edge  = from (r,c) to neighbor (nr,nc) if: in bounds
//              AND grid[nr][nc] === '1' AND not already visited
//   Q3 wrap  = count connected components. Scan every cell; each time you
//              find an unvisited '1', that's a NEW island (count++), then
//              flood-fill the whole blob so you don't count it again.

type Position = [number, number];

const directions: Position[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function numIslands(grid: string[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let count: number = 0;


  function flood([r, c]: Position): void {
    if (r < 0 || c < 0 || r >= rows || c >= cols) {
      return;
    }

    if (grid[r][c] === '0') {
      return;
    }

    grid[r][c] = '0';

    for(let [dr, dc] of directions) {
      flood([dr + r, dc + c]);
    }
  }

  for (let r = 0;r < rows;r++) {
    for (let c = 0;c < cols;c++) {
      if (grid[r][c] === '1') {
        count++;
        flood([r,c]);
      }
    }
  }

  return count;

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
