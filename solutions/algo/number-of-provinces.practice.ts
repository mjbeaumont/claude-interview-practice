// Number of Provinces — practice (recursive DFS)
//
// n x n matrix isConnected. isConnected[i][j] === 1 means city i and city j
// are directly connected. Return the number of provinces (connected groups).
//
// Decode (same WRAPPER as Number of Islands — only Q2 changes):
//   Q1 node  = a city index i
//   Q2 edge  = i connects to j iff isConnected[i][j] === 1
//   Q3 wrap  = count connected components. Scan every city; each unseen city
//              starts a NEW province (count++), then flood all cities reachable
//              from it.
//
// vs Islands: a "node" is now a plain number (city index), so `seen` holds
// numbers, not "r,c" strings. Neighbors come from scanning a matrix row
// instead of computing 4 grid offsets.

function findCircleNum(isConnected: number[][]): number {
 let count: number = 0; 
 const numProvinces = isConnected.length;
 const seen = new Set<number>();

 function flood(city: number) {
    seen.add(city);

    for(const [neighbor, connected] of isConnected[city].entries()) {
      if (connected === 1 && !seen.has(neighbor)) {
        flood(neighbor);
      }
    } 
 }

 for (let city = 0;city < numProvinces; city++) {
    if (!seen.has(city)) {
      count++;
      flood(city);
    }
 }

 return count;
}

// --- quick test harness ---
const cases: [number[][], number][] = [
  [
    [
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 1],
    ],
    2,
  ],
  [
    [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    3,
  ],
  [
    [
      [1, 0, 0, 1],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [1, 0, 0, 1],
    ],
    2,
  ],
  [
    // 0-1-2 all linked through 1
    [
      [1, 1, 0],
      [1, 1, 1],
      [0, 1, 1],
    ],
    1,
  ],
];
for (const [isConnected, exp] of cases) {
  const input = JSON.stringify(isConnected);
  const got = findCircleNum(isConnected);
  console.log(`${got === exp ? "✓" : "✗"} findCircleNum(${input}) = ${got} (exp ${exp})`);
}
