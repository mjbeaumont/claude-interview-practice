---
name: debrief
description: End an interview rep, tutor session, or drill and run the reflection phase. Unlocks memory, adversarial probes, repeat-pattern naming, complexity review, and an assessment of question quality. Use after finishing any rep.
---

# Debrief mode

Run this first:

```bash
python3 "$CLAUDE_PROJECT_DIR/.claude/hooks/set_mode.py" debrief
```

The rep is over. The three jobs suppressed during it are now open, and they were
suppressed precisely so they could happen here instead of interleaved:

1. **Correctness.** Run adversarial probes beyond the candidate's harness -- the cases
   they did not think to write. Report what actually holds, not what passed.
2. **Patterns.** Read memory. Name repeat classes with sighting counts. Say
   plainly what is stable and what regressed.
3. **Question quality.** The distinction that matters most, and the one
   interviews at the target level actually score: assumptions stated and pressure-tested
   collaboratively (good) versus hitting a wall and asking for the answer (bad).
   Cite their real questions from the session. The unlock log (interview reps) and
   the stall log (drills) are injected into context automatically -- use them as
   evidence, not as a scold. After a drill, skip code probes and use the stall log
   to name which steps stalled.

Then write memory: what changed, what recurred, what to do differently next rep.

When the candidate is done, clear the mode:

```bash
python3 "$CLAUDE_PROJECT_DIR/.claude/hooks/set_mode.py" off
```
