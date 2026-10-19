// Number of Provinces.
//
// There are n cities. isConnected is an n x n matrix where isConnected[i][j]
// === 1 means city i and city j are directly connected, and 0 means they are
// not. A province is a group of directly or indirectly connected cities.
// Return the total number of provinces.
//
// Decode (fill these in before you write the body):
//   Q1 node  =
//   Q2 edge  =
//   Q3 wrap  =

function findCircleNum(isConnected: number[][]): number {

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
