# Building a resume with Claude

There are two stages. First, build a **master resume**: one long document that holds everything you
could honestly claim. Then **cull** a short resume from it for each job. Never edit a tailored
resume directly. New material goes into the master, and a fresh cut comes out of it.

Keep everything in `resumes/`, which is gitignored.

## Stage 1: the master resume

The master is a working document, and it is long on purpose. Each role can have nine or more
bullets, plus context a real resume never carries. It doubles as your story bank for behavioral
interviews.

### Feed it evidence, not memory

Your memory undersells some work and oversells other work. Give Claude primary sources and let it
draft from them:

- **Your current resume**, as the skeleton.
- **Design docs and RFCs you wrote.** They hold the problem, the constraints, and the decision in
  your own words at the time.
- **Performance reviews and self-reviews.** They hold the impact framing and the numbers your manager
  agreed with.
- **Code.** Have Claude read your merged PRs in a repo, or the git log filtered to your author. PR
  counts, line counts, and date ranges become concrete throughput claims.
- **Dashboards and metrics**, for any before/after number.

If Claude has access to your docs, tickets, or data warehouse through MCP connectors, it can look
things up itself. Otherwise, paste or export the material.

### Verify two things for every claim

1. **Authorship.** Did you write it, or did you contribute to something someone else designed?
   Document metadata lies, especially for imported pages. If Claude cannot confirm it, it asks.
2. **Adoption.** Merged code proves it shipped, not that anyone uses it. Check usage data before
   you claim impact.

The verb carries the precision. "Built" and "implemented" survive an interviewer's follow-up where
"designed" and "owned" often do not.

### Kickoff prompt

```
I want to build a master resume: one long, honest document I will cull tailored resumes from.
It doubles as my behavioral-interview story bank, so it should be too long on purpose.

I'll give you my current resume plus source material: design docs I wrote, performance
reviews, and access to my code. Work through my career one role at a time:

1. Read the sources for that role and draft bullets from them, not from my summary.
2. Interview me to fill gaps. One question at a time. Ask for numbers, ask what happened
   before and after, and ask what I'd say if an interviewer pushed back.
3. Before you write any claim, check authorship (did I write it or contribute to it?) and
   adoption (is it actually used, or only merged?). If you can't verify it, ask me.
4. Anything unverified, unshipped, or partly someone else's work goes in a FLAGS section at
   the end, never in a bullet.
5. Keep internal ticket keys, PR numbers, hostnames, and internal service names out.

Draft each section as text for me to approve before you write it to resumes/MASTER-RESUME.md.
```

### Structure

- **Summary**: your pattern, not a list of skills.
- **Experience**: one section per initiative within each employer, each with a date range.
- **Skills** and **Education**.
- **Flags**: every claim that needs a caveat, a source, or a decision before it goes on a real resume.
  Examples: "the dashboard shows a 40% drop at p75, not the 10x I remembered" or "this proposal did
  not ship; keep the caveat or drop the bullet."

## Stage 2: culling a tailored resume

Each application gets its own cut. Start a new conversation, give it the master and the job
posting, and use this prompt:

```
I'm applying for a role. The job posting and my master resume are below.

The master is deliberately too long. It is a story bank, not a resume. Build a tailored resume
from it for this posting:

1. Pick the 12-16 bullets that best match this posting. Two pages is a hard maximum. If you're
   over, cut the bullets that are weakest for THIS posting. Don't shorten bullets to fit.
2. Lead with the most relevant domain. Keep reverse-chronological order within employers. Fold
   one-bullet sections into a combined section, because more than five or six headers reads like
   a table of contents.
3. Reorder the summary and skills to lead with what this posting cares about. Do not add items.
4. Do not invent, embellish, or merge claims. You MAY swap in the posting's vocabulary when the
   underlying claim is identical ("observability" for "monitoring"). If matching the posting's
   language would change the claim, flag it instead.
5. Respect the master's FLAGS. Unshipped work either keeps its caveat or gets dropped. It is never
   presented as delivered.
6. Keep vendor and technology names as written. They are ATS keywords.
7. Where a bullet has both an incident and an outcome, lead with the durable outcome.
8. Output clean markdown: no tables, columns, or graphics. ATS parsers choke on them.

After the resume, give me a short closing block:
- Which bullets you chose and what in the posting justified each.
- Strong bullets you cut and why.
- Anything the posting asks for that the master doesn't support.

JOB POSTING:
[paste here]

MASTER RESUME:
[paste here]
```

Save the result as `resumes/<COMPANY>-RESUME.md`. Before you send it, read every bullet out loud
and ask yourself whether you can defend it for five minutes. If you can't, cut it.

### Optional: a screen cheat sheet

For the same company, ask Claude for a one-page cheat sheet built from the tailored resume and the
posting. It covers the numbers you will quote, the likely questions with a one-line answer for each,
the gaps to admit and how to bridge from them, and what not to say. Then run a few mock screens
against it.
