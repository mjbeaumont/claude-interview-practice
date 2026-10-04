# Math primitives for coding problems

Unlike algorithmic patterns (two pointers, sliding window, bucket-by-key, BFS/DFS, DP), these
aren't things to derive in the room — they're recognized vocabulary, the same way "reach for a
hash map" is vocabulary. The skill being tested is noticing the trigger, not inventing the tool.
Small, closed list on purpose — don't sink derivation time here.

| Primitive | Trigger | Snippet |
|---|---|---|
| GCD / LCM (Euclidean algorithm) | Reduce a ratio/fraction to a canonical form — "these two are equivalent if their reduced form matches" | `function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }` <br> `lcm = (a * b) / gcd(a, b)` |
| Modular arithmetic wraparound | Circular index, clock arithmetic, letter-shift ciphers — anything that wraps past a boundary back to 0 | `((x % n) + n) % n` — the double-mod handles negative `x`, which JS's `%` alone won't normalize |
| `nCr`, esp. `n choose 2` | Counting how many pairs/combinations exist *within* a group, once you already know the group size | `n * (n - 1) / 2` for pairs; general form `n! / (k! * (n - k)!)` |
| Prefix sums | Repeated range-sum or subarray-sum queries — trade an `O(n)` re-scan per query for `O(1)` after one `O(n)` pass | `prefix[i] = prefix[i-1] + arr[i]`; range sum `[l, r]` = `prefix[r] - prefix[l-1]` |
| XOR properties | Find the single/missing/duplicate number where everything else is paired up | `a ^ a === 0`, `a ^ 0 === a`, XOR is commutative/associative — XOR the whole array, pairs cancel, the odd one out survives |
| Sieve of Eratosthenes | Need all primes up to N, not just a single primality check | Mark multiples of each prime starting at `p*p` as composite, up to `sqrt(N)` |

Add to this table as new problems surface a primitive not covered here — don't pad it with things
that never come up.
