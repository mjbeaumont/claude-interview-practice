---
name: prep-plan
description: Build a personal interview-prep plan. Runs a targeting intake, then a diagnostic quiz weighted by the target, then writes priorities, a skip list, and a timeline to PLAN.md. Use when starting prep or when the target changes.
---

# Prep plan

Three stages, in order. Ask one question at a time and wait for the answer. Give no feedback on
answers until the scoring stage.

If `PLAN.md` already exists, say so and ask whether to replace it or revise it. Never overwrite
it without a yes.

## 1. Intake

Ask these one at a time. Skip any the candidate already answered.

1. Target level (for example mid, senior, staff).
2. Company type: big tech, mid-size product company, startup, agency or consultancy, other.
3. Role shape: frontend, backend, full-stack, platform/infra, mobile, data.
4. What the loops look like, if known: algorithm coding, low-level design, system design,
   behavioral, take-home, language or framework trivia.
5. Timeline until interviews, and hours per day.
6. Interview language.
7. Where they think they're weak, and where they think they're strong.

Then restate the target in two lines and ask them to confirm. Example: "Senior full-stack at
mid-size product companies. Loops are coding, system design, and behavioral. Six weeks at an
hour a day."

Once they confirm, write `.claude/prep-settings.json`, keeping any keys already in it:

```json
{ "level": "senior", "company": "mid-size product", "role": "full-stack" }
```

`/interview` reads the level from this file.

## 2. Diagnostic

About 20 questions. Weight the categories by the intake answers:

- Data structures
- Algorithms
- Complexity
- System design
- Language runtime (for example the JS event loop, closures, Python's GIL)
- Practical judgment (code review, estimation, tradeoffs, debugging a production issue)

A big-tech target leans on algorithms and complexity. A product-company target leans on
practical judgment, system design, and the language runtime. Match the depth to the level.
Spend fewer questions on what they named as strong, but don't skip it: self-reports miss.

Question rules:
- Mostly open-ended. If you use multiple choice, never put the answer's key detail (a
  complexity, a structure name) in the options.
- Code-reading questions are good: "what does this do, and what's its complexity?", "what does
  this print, and in what order?", "find the bug."
- One question per turn. Number them ("Question 7 of 20, system design").
- No hints, no "close!", no corrections during the quiz.

## 3. Scoring and plan

Score each category with partial credit, and name the specific misses, not just the count.
Separate structural gaps ("doesn't know graph traversal") from narrow ones ("missed microtask
ordering").

Write `PLAN.md` with:

- **Target**: the confirmed two-line summary.
- **Scores**: category, score, and the specific misses.
- **Priorities**, in order. Each with a duration, one or two resources, and a rep target ("write
  BFS and DFS from scratch five times, then eight graph problems from easy").
- **Skip list**: what this target doesn't test, and why. This is as important as the priorities.
- **Timeline**: a week-by-week outline that fits the stated hours.
- **First rep**: the problem to start with, suitable for an assisted `/interview` rep or a `/tutor` session.

Show the plan as text and get a yes before writing it. Afterward, point them to `/tutor` or an
assisted `/interview` for the first rep.
