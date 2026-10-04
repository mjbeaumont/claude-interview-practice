# Predicate collapse — picking the technique on counting problems

For the family of problems phrased *"count the pairs / subarrays / triples where `<condition>`."*
Written 2026-08-28 after perfect-pairs, where I opened with the wrong question:
*"the conditional check seems simple enough — what's the best way to generate the permutations?"*

**The reframe: the technique is not chosen from the array's shape. It is chosen from what I can
prove about the predicate.** Enumeration is never the insight. Brute force is always available and
always the wrong final answer on a medium — so the moment I catch myself planning the loop, I'm
reasoning about the wrong object.

## Decode order

1. **Write the brute force.** `for i, for j, if (cond) count++`. Not to submit — to keep as a
   **correctness oracle** to diff the real solution against, including on randomized inputs.
2. **Isolate the predicate.** Stop looking at the array entirely. Only question that matters:
   can `cond` be rewritten as a relationship between two *scalars*?
3. **Rewrite until it collapses.**
4. **The collapsed form names the technique.**

| Collapsed predicate | Technique |
|---|---|
| `f(a) == f(b)` (equality on a canonical key) | frequency map / bucket by key, sum `nC2` |
| `f(a) + f(b) == target` | hash map complement lookup (two-sum) |
| `f(a) <= g(b)`, **monotone** | sort + two pointer / sliding window / binary search |
| nothing collapses, order matters | prefix sums, or DP |

## Why step 3 is load-bearing

`min(|a-b|, |a+b|) <= min(|a|, |b|)` is not monotone and reveals no technique. There is nothing
to pattern-match against. Rewritten, it becomes `y <= 2x` — the bigger absolute value is at most
twice the smaller — and *that* is monotone, and monotone-on-a-sorted-array **is** a two-pointer.

Same predicate, same problem. The technique only became visible after the rewrite.
**I don't choose the technique. I uncover it.**

## The two counting idioms (I cross-wire these)

Both count pairs. Different mechanics. Having recently drilled one makes it the reflex answer for
the other, so check which situation I'm actually in:

- **`k * (k - 1) / 2` — bucketing.** Partition into equivalence classes, count within each class.
  Use when the predicate collapsed to `f(a) == f(b)`.
- **`count += right - left` — sliding.** Fix the right end, count how far left I can reach. Each
  pair is counted exactly once because every pair has exactly one larger index. Use when the
  predicate collapsed to a monotone inequality. Generalizes to the whole
  "count subarrays where…" family.

## Sliding-window checks

- **The left pointer is monotone.** It only ever moves forward across the entire run. If I can't
  say why it never needs to go backward, I don't have a sliding window. Never reset it inside
  the outer loop — that's O(n²) wearing a two-pointer costume.
- **Advance `left` while the window is INVALID,** not while it's valid. Easy to invert.
- **Endpoints certify the interior.** On a sorted array, checking `arr[right]` against `arr[left]`
  proves every pair inside the window, because
  `arr[j] <= arr[right] <= 2*arr[left] <= 2*arr[i]` for any `i < j` in the window.
- **Trust the invariant to delete the guard.** No bounds check needed on the inner `while` if
  `left === right` makes the condition provably false (here: `v > 2v` is false for all `v >= 0`).

## Flashcards vs. derivations

Worth separating honestly, so a lookup gap doesn't get filed as a reasoning failure:

- **Flashcard** (memorize, don't plan to derive under pressure):
  `{ |a-b|, |a+b| } == { ||a| - |b||, |a| + |b| }` — always, for any signs. The signs of `a` and `b`
  only decide which *label* lands on which value; the two values never change. Consequence: any
  condition written in terms of `|a-b|` and `|a+b|` is secretly a condition on `|a|` and `|b|`
  alone, and sign analysis can be dropped entirely.
- **Derivation** (the transferable skill): steps 1–4 above.

## Worked example — perfect pairs

Count pairs `i < j` where `min(|a-b|, |a+b|) <= min(|a|, |b|)` **and**
`max(|a-b|, |a+b|) >= max(|a|, |b|)`.

1. Apply the identity → both conditions are now functions of `|a|`, `|b|` only.
2. `||a|-|b||` is always the smaller, `|a|+|b|` always the larger (both non-negative).
3. Condition 2 becomes `|a| + |b| >= max(|a|, |b|)` — always true for non-negatives. **Decoy, delete it.**
4. Condition 1 becomes `||a|-|b|| <= min(|a|, |b|)`. With `x = min`, `y = max`: `y - x <= x`, so `y <= 2x`.
5. Monotone inequality on non-negatives → sort the absolute values, two-pointer sweep.

```ts
function perfectPairs(nums: number[]): number {
  const sorted = nums.map(num => Math.abs(num)).sort((a, b) => a - b);
  let left = 0;
  let pairs = 0;
  for (let right = 1; right < sorted.length; right++) {
    while (sorted[right] > sorted[left] * 2) {
      left++;
    }
    pairs += right - left;
  }
  return pairs;
}
```

O(n log n) for the sort, O(n) for the sweep.

## Drills

1. **Subarray Product Less Than K** — same skeleton, but `count += right - left + 1`.
   Work out why that one has the `+1` and perfect-pairs doesn't.
2. **Count Number of Nice Subarrays** — forces a choice between sliding and prefix-map
   (rows 1 and 3 of the table).
3. **Two Sum II (sorted)** — the complement/two-pointer technique in its plainest form.
