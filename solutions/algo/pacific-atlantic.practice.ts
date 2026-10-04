// Pacific Atlantic Water Flow — practice
//
// Grid of heights. Water flows from a cell to an up/down/left/right neighbor
// if that neighbor's height is <= the current cell's height (downhill or equal).
// Pacific  = top row + left column.
// Atlantic = bottom row + right column.
// Return every cell from which water can reach BOTH oceans.
//
// Trick: don't flow downhill from every cell. Stand in each ocean and climb
// UPHILL into the land. If you can climb from the ocean to cell X, then water
// from X can flow back down to that ocean. Run it once per ocean, intersect.

function pacificAtlantic(heights: number[][]): number[][] {
  const rows = heights.length;
  const cols = heights[0].length;

  // One reusable traversal: flood "uphill" from a set of starting cells,
  // return the set of all cells reachable ("r,c" keys).
  function reachable(starts: [number, number][]): Set<string> {
    const queue = [...starts];
    const seen = new Set<string>(starts.map(([r, c]) => `${r},${c}`));

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue; // off-grid
        if (seen.has(`${nr},${nc}`)) continue;                      // already done

        // Climbing uphill from the ocean: skip neighbors water couldn't flow down from.
        if (heights[nr][nc] < heights[r][c]) continue;

        seen.add(`${nr},${nc}`);
        queue.push([nr, nc]);
      }
    }
    return seen;
  }

  // Seed each search with the cells touching its ocean.
  const pacificSeeds: [number, number][] = [];  // top row + left column
  const atlanticSeeds: [number, number][] = []; // bottom row + right column
  for (let r = 0; r < rows; r++) {
    pacificSeeds.push([r, 0]);
    atlanticSeeds.push([r, cols - 1]);
  }

  for (let c = 0; c < cols; c++) {
    pacificSeeds.push([0, c]);
    atlanticSeeds.push([rows - 1, c]);
  }

  const pac = reachable(pacificSeeds);
  const atl = reachable(atlanticSeeds);

  const result: number[][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pac.has(`${r},${c}`) && atl.has(`${r},${c}`)) {
        result.push([r, c]);
      }
    }
  }
  return result;
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
