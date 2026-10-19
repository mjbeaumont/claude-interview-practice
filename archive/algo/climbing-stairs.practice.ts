// Climbing Stairs.
//
// You're climbing a staircase with n steps. Each move you can climb either
// 1 or 2 steps. Return the number of distinct ways to reach the top.
//   n = 2   ways = 2   (1+1, 2)
//   n = 3   ways = 3   (1+1+1, 1+2, 2+1)

function climbStairs(n: number): number {

}

// ---- test harness ----
const stairsCases: [number, number][] = [
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 5],
  [5, 8],
  [10, 89],
];
for (const [n, exp] of stairsCases) {
  const got = climbStairs(n);
  const pass = got === exp;
  console.log(`${pass ? "✓" : "✗"} climbStairs(${n}) = ${got} (exp ${exp})`);
}
