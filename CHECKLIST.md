# Grid / Graph problem checklist

Built from my own misses, not generic advice. The recurring failure mode: I solve fast
(<5 min), the tests pass, and the code is **still wrong** — because the bugs only show on
inputs my own friendly tests don't include. So this runs *before* I trust green, not after
it goes red.

## A — Pre-submit scan (run before trusting the tests, ~60s)

- [ ] **Sizing:** `rows = grid.length`, `cols = grid[0].length`. Never the same expression
      twice. *(rotting-oranges: had `cols = grid.length` — passed every square test, broke on
      a non-square grid.)*
- [ ] **Bounds:** all four checks present, and `nr` is guarded against `rows`, `nc` against
      `cols` — no transpose. *(rotting-oranges: `nr >= cols` instead of `nc >= cols`. Latent —
      no test caught it because an out-of-column read returns `undefined`, which fails `=== 1`.)*
- [ ] **Mark = traverse:** every "mark seen / mark rotten" is paired with the actual
      recurse-or-enqueue. Bookkeeping is not traversal. *(provinces: did `seen.add(neighbor)`
      but forgot `flood(neighbor)` — only explored direct neighbors, not chains.)*
- [ ] **Counters:** `++`/`--` on the correct branch; boundary comparisons — `<` vs `<=`,
      `>` vs `>=`. *(rate-limiter: `now > expiresAt` where the contract said dead at `>=` —
      window lived one tick too long.)*
- [ ] **Mutate on enqueue, not on dequeue** (BFS), or you double-count a cell already queued.

## B — Throw the mean input at it (my own tests are too friendly)

The bugs above all hid because my test inputs were nice. Generate the adversarial ones:

- [ ] **Non-square grid** — catches sizing / transpose bugs.
- [ ] **Transitive chain** `0–1–2` with the ends NOT directly linked — catches missing
      recursion in connected-components.
- [ ] **Degenerate** — single cell, all-empty, no-fresh / no-seeds.
- [ ] **Walled-off / unreachable** cell — forces the `-1` or "never completes" path.

## C — Only now, if it's actually red

- [ ] `console.log` the queue + counters per wave / per visit. Don't reach for this before
      A and B.

---

**The meta-lesson:** speed is fine; the cost of speed is mechanical bugs (transposed `r`/`c`,
wrong dimension, dropped recursive call) that pass friendly tests. The fix isn't slowing down —
it's a fast pre-submit scan + deliberately mean inputs.

---

# When I'm stuck

The goal: never freeze. Always have a next move. In an interview, bugs aren't the failure —
going silent is. Narrating "let me trace a small example" out loud is *senior* behavior.

**First, name which kind of stuck I'm in — they have different fixes:**

### A — Stuck on approach (blank page, "I don't know how to start")
- Run the decode: Q1 node / Q2 edge / Q3 wrapper.
- If it's an algorithm I don't have memorized (token bucket, etc.): **derive it from the
  goal.** These are named solutions to a stated problem, not incantations. Deriving out loud
  is a *stronger* signal than reciting. (I derived token bucket + sliding-window counter cold.)

### B — Stuck on a bug (code is written, output is wrong or it hangs)
This is where I actually get stuck. The procedure:

1. **Make the failure concrete — read what it actually says.** Not "it's broken" →
   "it returned the 4-node square for a 1-node input." Self-question that cracks scope/state
   bugs: *"the output contains something that isn't in my input — what produced it?"*
2. **Trace the smallest failing example by hand, call by call, watching state.** Highest-yield
   move, first one dropped under pressure.
3. **Localize:** which line is the *first* to do something I didn't expect?
4. **Instrument** (`console.log` the state at that line) only if the hand-trace wasn't enough.

### Recursion sub-kit (the part I didn't know I had)
**You CAN instrument and trace recursion.** This was a blind spot.
- **Log on entry with depth:** `console.log('  '.repeat(depth) + ` + "`enter f(${arg})`" + `)`.
  The output's shape *is* the diagnosis — repeated args (`1→2→1→2…`) = I keep re-entering nodes
  I've already entered.
- **Hand-trace = draw the call tree, indenting each level.** The moment the same call appears
  twice in one descending branch, that's a non-terminating cycle.
- **For graph recursion, the base case that matters is NOT `node === null` — it's "have I
  already visited this? then stop."** Termination lives in the visited/memo check.
- **Diagnostic question for ANY infinite recursion:** *"what is supposed to make this
  terminate, and is that condition actually checked AND acted on?"* (My clone bug: I looked
  the cache up but didn't `return` on the hit — checked, not acted on.)

**Set vs Map for "visited":** Set when revisiting means *skip*. Map when revisiting means
*reuse what I built last time* (clone graph: I need the clone back to reconnect the edge).
