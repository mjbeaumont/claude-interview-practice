# 1D DP — the skeleton

For filling in the code *after* you have the recurrence. Deriving the recurrence is a separate
skill and is not templated.

## Before you write: is it DP?

| the problem says | technique |
|---|---|
| **count** the ways, or **max/min/fewest** over arrangements | DP |
| **list / return all** arrangements | backtracking |

Confirm with: *would naive recursion call itself with the same arguments twice?* Yes → overlapping
subproblems → memoize or tabulate.

## The six slots

| # | slot | question |
|---|---|---|
| 1 | **State** | what does `dp[i]` *mean*? Write the sentence down before any code. |
| 2 | **Size** | `n` or `n + 1`? Decided by whether `dp[0]` means "empty" or "first element". |
| 3 | **Base** | seed as many cells as the transition looks back. Looks back 2 → seed 2. |
| 4 | **Order** | reads `i-1` → forward. Reads `i+1` → backward. |
| 5 | **Transition** | the recurrence. |
| 6 | **Answer** | **not automatically the last cell** — see the fork below. |
| 7 | **Space** | collapse only if the lookback is fixed and small. |

## Two skeletons

```ts
// TOP-DOWN — mirrors the recurrence literally; write this first
const memo = new Map<number, number>();
function solve(i: number): number {
  if (i <= 1) return base;                       // 3
  const cached = memo.get(i);
  if (cached !== undefined) return cached;       // check `cached`, not `i`
  const result = f(solve(i - 1), solve(i - 2));  // 5
  memo.set(i, result);
  return result;
}

// BOTTOM-UP — same recurrence, loop replaces the call stack
const dp = new Array(n + 1);                     // 2
dp[0] = base0; dp[1] = base1;                    // 3
for (let i = 2; i <= n; i++) {                   // 4
  dp[i] = f(dp[i - 1], dp[i - 2]);               // 5
}
return dp[n];                                    // 6
```

## Slot 6 — the answer-location fork

| how `dp[i]` is defined | answer |
|---|---|
| "best over the **first `i`** items" (prefix / target) | one cell — `dp[n]` |
| "best **ending exactly at** `i`" | **`Math.max(...dp)`** — every cell is a candidate |

Fib, climbing stairs, house robber, coin change → first row.
Max subarray, LIS → second row.

## Slot 7 — space collapse

| lookback | storage |
|---|---|
| fixed, small (`i-1`, `i-2`) | rolling variables, no array |
| variable / wide (`i - c` for each coin) | full array, can't collapse |

## Sentinels

Impossible states need a value that loses the comparison and doesn't corrupt arithmetic.
For a `min` problem use `Infinity`, convert at the return (`=== Infinity ? -1 : result`).
**Never `-1`** — `1 + (-1) === 0` wins the `min` and silently poisons the table.

## Four ways I get this wrong

1. **Lookback relative to the target instead of the current cell.** `dp[amount - c]` where it should
   be `dp[i - c]`. `i` is the amount being solved *now*; `amount` is only where the loop stops.
   `dp[i]` may only ever read **smaller** indices. *(coin change → NaN)*
2. **Combine first, then adjust.** Maxing the branch values and *then* conditionally adding the gain.
   Each branch is a sealed package — finish it to a number, *then* combine. *(house robber)*
3. **Conflating `dp[i]` with the running max.** Produces a bogus third term in the recurrence and
   leaks a non-contiguous value forward. *(max subarray — `[-2,5,-100,3]` catches it)*
4. **TS "used before assigned"** on a variable only assigned inside a loop — TS treats every loop as
   possibly zero-trip. Initialize it before the loop; don't reach for `!`.

## Reps

- done (both tabular + memo): fibonacci, climbing stairs, house robber, max subarray, coin change, LIS
- next: Decode Ways · Word Break · Jump Game
