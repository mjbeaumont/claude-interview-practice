// Fibonacci Number (1D DP).
//
// Given n, return the nth Fibonacci number. F(0) = 0, F(1) = 1, and
// F(n) = F(n-1) + F(n-2) for n > 1. Solve it bottom-up in O(n) time using
// O(1) extra space (no recursion, no memo array).

function fib(n: number): number {
  let twoBack: number = 0;
  let oneBack: number = 1; 
  let next: number = 0;

  if (n === 0) return twoBack;
  if (n === 1) return oneBack;

  for(let i = 2;i <= n;i++) {
    next = twoBack + oneBack;
    twoBack = oneBack;
    oneBack = next;
  }
  
  return next;
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
