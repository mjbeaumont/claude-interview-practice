// Fibonacci Number.
//
// Given n, return the nth Fibonacci number. F(0) = 0, F(1) = 1, and
// F(n) = F(n-1) + F(n-2) for n > 1. Solve it in O(n) time using O(1)
// extra space.

function fib(n: number): number {

}

// ---- test harness ----
const fibCases: [number, number][] = [
  [0, 0],
  [1, 1],
  [2, 1],
  [3, 2],
  [4, 3],
  [5, 5],
  [10, 55],
];
for (const [n, exp] of fibCases) {
  const got = fib(n);
  const pass = got === exp;
  console.log(`${pass ? "✓" : "✗"} fib(${n}) = ${got} (exp ${exp})`);
}
