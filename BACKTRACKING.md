# Backtracking — the skeleton

Copy this. Don't rederive it.

## Before you write: is it backtracking?

| the problem says | technique |
|---|---|
| **return / list all** arrangements | backtracking |
| **count** them, or **max/min** over them | DP — don't enumerate |
| one arrangement, any valid one | greedy first; backtracking if greedy can fail |

Output is exponential (`2^n` subsets, `n!` permutations), so exhaustive search *is* the expected
answer. No apology needed for the complexity — it's output-bound.

## The skeleton — four slots

```ts
const results: T[][] = [];
const path: T[] = [];

function backtrack(start: number) {
  if (isComplete()) { results.push([...path]); return; }  // 1. RECORD — copy, never the buffer
  for (let i = start; i < choices.length; i++) {
    if (!isValid(choices[i])) continue;                   //    PRUNE
    path.push(choices[i]);                                // 2. APPLY
    backtrack(i + 1);                                     // 3. RECURSE
    path.pop();                                           // 4. UNDO — mirrors slot 2 exactly
  }
}

backtrack(0);
return results;
```

- **The helper returns `void`.** Results go into the closure array. Never `return` the answer up.
- **Apply / recurse / undo are three adjacent lines.** If they drift apart, the undo is wrong.
- **`[...path]`, always.** See bugs below.

## What changes per question shape

| want | loop starts at | recurse with | record where |
|---|---|---|---|
| **subsets** (78) | `i = start` | `i + 1` | **every node** — on entry, no guard |
| **combinations of size k** (77) | `i = start` | `i + 1` | leaves — `path.length === k` |
| **combination sum**, reuse allowed (39) | `i = start` | `i` *(not `i+1`)* | `sum === target`; prune `sum > target` |
| **permutations** (46) | `i = 0` **every level** | `0`, skip `used[i]` | leaves — `path.length === n` |

Two knobs, that's all: **where the loop starts** (order matters → `0`; doesn't → `start`) and
**where you record** (every node vs. leaves only).

## Does it need an undo?

| how you build the path | undo |
|---|---|
| shared array, `path.push(x)` | **required** — `path.pop()` |
| new value each call, `` backtrack(`${current}${c}`) `` | none — nothing was mutated |

Immutable building is simpler and slower. Either is fine at interview scale.

## Two ways I get this wrong (both sighted)

1. **`return` from a `void` helper.** Wrote `return current` in the base case, but the call site is
   a bare `backtrack(...)` — the value evaporates and `results` stays empty. *(LC 17)*
   **Push into the closure array. Don't return.**
2. **Stored a reference, not a snapshot.** `results.push(path)` stores the live buffer; later
   `.pop()` calls from sibling branches mutate it *after* it's already in `results`.
   `console.log` at the push site looks correct, the final array doesn't. *(LC 78)*
   **`results.push([...path])`.**

Same root cause both times: **recursive state doesn't become safe just because you touched it.**

## Pruning

The `continue` / early `return` is the only place speed comes from — the skeleton is fixed, the
pruning is the problem-specific part. Prune as early as the check is valid (before recursing,
not inside the next level).

## Reps

- done: Letter Combinations (17), Subsets (78)
- next: Permutations (46) — first one needing `used[]`
- then: Combination Sum (39) — reuse, `i` not `i+1` · N-Queens (51) — real pruning
