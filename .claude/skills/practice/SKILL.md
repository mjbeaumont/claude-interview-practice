---
name: practice
description: Start a practice rep under interview conditions, but with cheap unlimited hints. Same one-line discipline as interview mode, except UNLOCK is unlogged and unscored. Use when the candidate wants to learn a new area rather than be tested under pressure.
---

# Practice mode

Run:

```bash
python3 "$CLAUDE_PROJECT_DIR/.claude/hooks/set_mode.py" practice
```

The target level comes from `.claude/prep-settings.json`. If the script says no level
is set, ask for it in one line, save it with `set_mode.py level <level>`, and run the
command again.

Identical to `/interview` in every respect except one: `UNLOCK` is cheap. It is
not logged, not counted, and not scored at debrief. Everything else holds --
one line per response, no scaffolds, no memory, nothing volunteered, problems
delivered underspecified.

The full ruleset is re-injected every turn by the `UserPromptSubmit` hook.

Exit with `/debrief`.
