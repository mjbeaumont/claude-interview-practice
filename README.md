# Interview practice

- `algo/`: blank algorithm scaffolds
- `lld/`: blank low-level design scaffolds
- `solutions/`: worked solutions, same layout

Each file is self-contained: a problem description, an empty body, and a test harness at the bottom.

## Running

Needs Node >= 22.18 (runs TypeScript natively, no install step).

```sh
pnpm p algo/coin-change.practice.ts   # run once
pnpm w algo/coin-change.practice.ts   # rerun on save
```

The message queue's tests live in `lld/message-queue.harness.ts`; run that file instead of the practice file.

## Practicing with Claude Code

Start with `/prep-plan`. Claude asks about your target (level, company type, role, timeline), runs a diagnostic quiz weighted by it, and writes `PLAN.md` (gitignored): priorities, a skip list, and a timeline. `CLAUDE.md` tells Claude to read the plan and tutor Socratically.

Four slash commands then turn Claude into an interviewer, tutor, or drill partner:

- `/interview`: a realistic rep at your target level, in a hard or assisted setting (it asks). Claude gives an underspecified problem and replies in one line at a time. It gives no code and no hints, and it doesn't volunteer test results. Typing `UNLOCK` buys one block of full help. In hard it is logged for the debrief. In assisted it is free.
- `/tutor`: a deep dive on a topic you choose. You drive, hints are one sentence, and Claude never names the technique in a problem it poses.
- `/drill`: short reps on one skill. Content types are recognition (brute force to technique in five steps) and invariant (state what each variable promises, or trace a loop to its first false row).
- `/debrief`: ends the rep. Claude reviews correctness with extra edge cases, names recurring mistakes, and assesses the quality of your questions, using the unlock and stall logs as evidence.

While an interview or tutor session is active, a hook blocks Claude from editing `*.practice.ts` files, so you write the code. The rules are re-injected every turn so they don't fade over a long session. The mode lives in `.claude/.interview-state` (gitignored); `/debrief` resets it, or run `python3 .claude/hooks/set_mode.py off`. Your target level lives in `.claude/prep-settings.json` (gitignored). `/prep-plan` sets it, or run `python3 .claude/hooks/set_mode.py level senior`.

## Why it's built this way

The first version was a prompt: "teach Socratically, hints not answers." It didn't hold. Over a
long session Claude drifted back toward being helpful: it wrote skeletons, named the failing test
cases, and explained the approach before I'd found it. Each piece below fixes one way that went
wrong.

- **Rules fade, so they're re-injected every turn.** A `UserPromptSubmit` hook
  (`.claude/hooks/mode_context.py`) adds the active mode's full ruleset to every prompt. It doesn't
  rely on instructions from the start of the session surviving.
- **Instructions get bent, so the important one is mechanical.** A `PreToolUse` hook
  (`block_practice_writes.py`) denies edits to `*.practice.ts` while an interview or tutor session is active. "Don't write
  my code" is enforced, not requested.
- **Interviewing and learning were mixed, so they're separate modes.** During a rep Claude has no
  memory of past sessions and volunteers nothing. Noticing your own recurring mistake is the skill
  being trained, so pattern-naming, edge-case probes, and review all wait for `/debrief`.
- **Some help is legitimate, so it's priced, not banned.** `UNLOCK` buys one block of full help.
  In interview mode each one is logged with the question that preceded it, and the debrief judges
  whether the question was a scoped ask or a fold.
- **Problem statements leak answers, so delivery is constrained.** Problems arrive as one
  underspecified sentence, with no named data structures, complexity targets, or preview of later
  stages. Pulling out the requirements is part of the rep.
- **Terse teaching was hard to follow, so replies follow a style spec.** The mode text adapts
  ASD-STE100 Simplified Technical English: one idea per sentence, one name per concept, condition
  first, no hedging modals. A self-check list catches drift before a reply goes out.
- **The target shapes everything, so it's set once.** `/prep-plan` runs an intake and a diagnostic
  quiz, writes a plan with an explicit skip list, and stores the target level that the modes read.

## Resumes

`RESUME-GUIDE.md` covers building a master resume with Claude from your docs, reviews, and code, then culling a tailored resume from it for each job. Personal files go in `resumes/`, which is gitignored.
