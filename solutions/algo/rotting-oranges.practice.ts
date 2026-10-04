// Rotting Oranges — practice (level-counted multi-source BFS)
//
// Grid values: 0 = empty, 1 = fresh, 2 = rotten.
// Each minute, every rotten orange rots its up/down/left/right fresh neighbors
// (simultaneously). Return minutes until no fresh orange remains, or -1 if some
// fresh orange can never rot. 0 if there were no fresh oranges to begin with.
//
// Decode:
//   Q1 node  = a grid cell (r, c)
//   Q2 seeds = ALL rotten (2) cells go in the queue at minute 0 (multi-source)
//        edge = spread to an in-bounds neighbor that is fresh (1); 0 = wall
//   Q3 wrap  = level-counted BFS. Each WAVE of the queue = one minute.
//              Track fresh count; answer = minutes, or -1 if fresh remains.
//
// THE NEW SHAPE vs Islands/Provinces:
//   - multi-source: many cells in the queue before the loop starts
//   - level counting: freeze `waveSize = queue.length`, process exactly that
//     many, THEN minutes++. The frozen snapshot is what separates one wave
//     (minute) from the next.

type Cell = [number, number];

const directions: Cell[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function orangesRotting(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;

  const queue: Cell[] = [];
  let fresh: number = 0;
  let minutes: number = 0;
  

  for(let r = 0;r < rows; r++) {
    for(let c = 0;c< cols; c++) {
      if (grid[r][c] === 2) {
        queue.push([r,c]);
      }

      if (grid[r][c] === 1) {
        fresh++;
      }
    }
  }

  while(queue.length > 0 && fresh > 0) {
    const waveLength = queue.length;
    for(let i = 0;i < waveLength;i++) {
      const [r,c] = queue.shift()!; 
      for (const [dr, dc] of directions) {
        const nr = dr + r;
        const nc = dc + c;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) {
          continue;
        }

        if (grid[nr][nc] !== 1) {
          continue;
        }

        grid[nr][nc] = 2;
        fresh--;
        queue.push([nr,nc]);
      }
    }
    minutes++;
  }

  return fresh === 0 ? minutes : -1;
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
