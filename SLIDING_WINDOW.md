# Sliding window — the skeleton

Copy this. Don't rederive it. Fluency comes from using it, not from remembering it.

## Before you write: can adding ever *help*?

Adding an element must never make a bad window good. If it can, `left` would need to back up — and
`left` never backs up. Not a sliding window.

| predicate is about | legal only if | breaks on |
|---|---|---|
| **product** | every value `>= 1` | `0`, negatives, fractions |
| **sum** | every value `>= 0` | negatives |
| **distinct count / frequency** | always legal | — |
| **comparing values across the window** | array is sorted | unsorted input |

Check the constraints for this before anything else. No guarantee → different technique.

## The skeleton — four slots, always this order

```ts
let left = 0;
for (let right = 0; right < arr.length; right++) {
  add(arr[right]);                 // 1. GROW    — unconditional, exactly once
  while (isInvalid()) {            // 2. SHRINK  — `while`, not `if`
    remove(arr[left]);
    left++;
  }
  record();                        // 3. RECORD  — no guard needed; slot 2 guarantees validity
}                                  // 4. LOOP
```

| pointer | movement |
|---|---|
| `right` | the `for` variable. Advances **exactly once per iteration**, unconditionally. |
| `left` | **purely reactive.** Moves zero or more times, only to restore validity. **Never resets.** |

**`right` must be the outer/`for` pointer.** Then `right < arr.length` *is* the bounds check —
free and impossible to forget. Invert the roles and you have to remember it manually.

## Three endings, one skeleton

```ts
// LONGEST valid window        — shrink while INVALID, record after
best = Math.max(best, right - left + 1);

// COUNT valid subarrays       — shrink while INVALID, count after
count += right - left + 1;

// SHORTEST valid window       — shrink while VALID, record INSIDE the while
while (isValid()) {
  best = Math.min(best, right - left + 1);
  remove(arr[left]); left++;
}
```

The counting ending works because **endpoints certify the interior** — if `[left..right]` is valid,
so is every subarray inside it ending at `right` — dropping elements off the front can only move you
further under the limit. That's the "adding always hurts" property above, doing real work. It is not
a freebie: if you can't say why adding always hurts, you can't use this line.

## The `+ 1` rule

**`+1` is a fact about your bounds, not about subarrays.** Before writing the count, say which
`right` you have:

- `right` is the **last valid** index (canonical window) → `right - left + 1`
- `right` is the **first invalid** index (scan-until-break) → `right - left`

Same for pairs vs subarrays: a subarray of one element counts, a "pair" of one element doesn't.
Counting pairs `(i, right)` → `right - left`. Counting subarrays `[i..right]` → `right - left + 1`.

## Two ways I get this wrong (both sighted twice)

1. **Inverting the pointer roles** — outer loop on `left`, inner loop expanding `right`.
   Fails the same way every time: `right` runs off the end (out-of-bounds, or `undefined` → `NaN`).
   *(LC 1208, LC 713)*
2. **Resetting a pointer inside the other's loop** — `left = 0` or `let right = left` at the top of
   the body. Silently O(n²): brute force wearing a two-pointer costume. *(perfect-pairs, LC 713)*

**The check that catches both: does each pointer traverse the array once *total*, or once per
iteration of the other?**

## Bounds

If *no* window can ever be valid (e.g. `k <= 1` for a product problem), the shrink loop will push
`left` past `right`. Decide whether the invariant prevents it — and if it doesn't, the guard is
`left <= right` in the `while` condition. This is guard bucket 3 (bounds) from the guard framework.

## Reps

- longest: Get Equal Substrings Within Budget (1208), Longest Substring Without Repeating (3)
- count: Subarray Product Less Than K (713), Count Nice Subarrays (1248)
- shortest: Minimum Window Substring (76), Minimum Size Subarray Sum (209)
