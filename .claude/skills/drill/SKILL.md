---
name: drill
description: Short reps on one skill. Content types are recognition (walk a fresh problem from brute force to the technique in five steps) and invariant (state what each variable promises, or trace a buggy loop to its first false row). Teaching mode, not an interview.
---

# Drill mode

One mode, with two settings. If the candidate did not name them, ask both in one
question tool call.

Content type:

- **Recognition.** Brute force to technique, five steps.
- **Invariant.** State the invariant, or trace to the first false row.

Help level:

- **Assisted.** Concrete numbers and yes or no questions when stuck. A short
  explanation on "tell me why".
- **Hard.** One line per turn. No hints. Bare "stuck" gets no help. `UNLOCK` buys one
  full-help block and is logged for debrief.

Then run, with the content type and the help level:

```bash
python3 "$CLAUDE_PROJECT_DIR/.claude/hooks/set_mode.py" drill <recognition|invariant> <assisted|hard>
```

For recognition, read `patterns.md` in this skill's directory. Do not read it aloud or
name its entries to the candidate. It is the rotation, not a handout. Pick the first
problem from a pattern that has not run this session. Deliver it as one plain statement
and one example. Show the five-step frame once. Name step 1.

For invariant, write a fresh loop and test it before delivery. Start with a state rep.
Alternate with trace reps.

The full ruleset is re-injected every turn by the `UserPromptSubmit` hook. It differs
from `/interview` on purpose. Facts get corrected, and the frame is visible.

To add a content type, add its rule block to the hook and its name to the mode script.
The skill needs no other change.

Exit with `/debrief`. Debrief reads the stall log, and the UNLOCK log in a hard drill.
