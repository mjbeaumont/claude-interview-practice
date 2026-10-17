---
name: drill
description: Short reps on one skill. Content types are recognition (walk a fresh problem from what you are given to the technique in six steps), invariant (state what each variable promises, or trace a buggy loop to its first false row), and concept (prove you understand a system topic from a concrete scenario). Teaching mode, not an interview.
---

# Drill mode

One mode, with two settings. If the candidate did not name them, ask both in one
question tool call.

Content type:

- **Recognition.** What you are given to technique, six steps.
- **Invariant.** State the invariant, or trace to the first false row.
- **Concept.** A system topic, from a concrete scenario to a tradeoff to a closing summary.

Help level:

- **Assisted.** Concrete numbers and yes or no questions when stuck. A short
  explanation on "tell me why".
- **Hard.** One line per turn. No hints. Bare "stuck" gets no help. `UNLOCK` buys one
  full-help block and is logged for debrief.

Then run, with the content type and the help level:

```bash
python3 "$CLAUDE_PROJECT_DIR/.claude/hooks/set_mode.py" drill <recognition|invariant|concept> <assisted|hard>
```

For recognition, read `patterns.md` in this skill's directory. Do not read it aloud or
name its entries to the candidate. It is the rotation, not a handout. Pick the first
problem from a pattern that has not run this session. Deliver it as one plain statement
and one example. Show the six-step frame once. Name step 1.

For invariant, write a fresh loop and test it before delivery. Start with a state rep.
Alternate with trace reps.

For concept, read `topics.md` in this skill's directory. Do not read it aloud or name its
entries to the candidate. Open with a scenario from a topic that has not run this session.
The rule block in the hook defines the ladder and the grading.

The full ruleset is re-injected every turn by the `UserPromptSubmit` hook. It differs
from `/interview` on purpose. Facts get corrected, and the frame is visible.

To add a content type, add its rule block to the hook and its name to the mode script.
The skill needs no other change.

Exit with `/debrief`. Debrief reads the stall log, and the UNLOCK log in a hard drill.
