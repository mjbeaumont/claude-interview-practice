# Scale breakpoints — reacting to the number

For the moment in a system design round when they hand me a number and I have to know what it
*forces*. Written 2026-09-20 after the metered-billing rep, where I was given 500k events/sec,
correctly thought "oh shit, that's a lot," and could not say which choices it took off the table.

**This doesn't do the math for me.** I still have to work out how much data a number generates,
what the write rate is, and what the jobs over it cost. The charts only turn a number I've
already computed into a decision. Everything here is order of magnitude — vendor docs are the
source of truth for any specific ceiling.

## Reaction order

1. **Convert to per-second and per-day.** Numbers arrive as "50k devices, once a minute" or
   "3 billion tasks a year." Get to a rate before reasoning about anything.
2. **Ask for the distribution.** An average is a lie if the top 1% sends half the traffic. The
   hottest single key sizes the system, not the total.
3. **Check all four axes.** They fail independently. In the billing rep the key survived on
   throughput and died on storage.
4. **Say the breakpoint, not the number.** "I'd keep raw events here; that stops working around
   100k/s, where I'd pre-aggregate." That sentence is what's being scored.

## Conversions

- 86,400 sec/day · ~2.6M sec/month · ~31.5M sec/year
- 1k/s = 86M/day · 10k/s = 864M/day · 1M/s ≈ 86B/day
- 1B/month ≈ 400/s avg · 1B/year ≈ 32/s avg
- Peak is typically 2-5x average — ask, don't assume
- rows/day × row size = GB/day. The multiply that decides if raw storage survives.

## 1. Write throughput

| writes/sec | Forced |
|---|---|
| **< 1k** | One DB, synchronous writes, raw rows. A queue here is decoupling, not scale. |
| **1k - 100k** | Partitioned key mandatory past ~10k. Queue for buffering and for producers that can't retry. Raw storage and a dedup table both still fine. |
| **> 100k** | Pre-aggregate before the durable write. Needs a partitioned log with consumer affinity, not a generic queue. Raw events tier to object storage or die. |

## 2. Storage

| Total volume | Forced |
|---|---|
| **< 1 TB** | One instance. Retention policy is a nicety. |
| **1 - 10 TB** | Shard or partition. Retention becomes a real decision; indexes and backups start hurting more than the data. |
| **> 10 TB** | Tiering mandatory — hot store plus object storage. Keeping raw is now a pricing conversation, not a technical one. |

Per-partition ceilings bite long before the totals do. Dynamo's 10 GB per partition is the one
I'd have missed — 43M writes/day × 1 KB = 43 GB into a 10 GB cap.

## 3. Read / query

| reads/sec | Forced |
|---|---|
| **< 1k** | Hit the DB. |
| **1k - 100k** | Cache the hot set; read replicas. Past ~10k the cache is mandatory, not an optimization. |
| **> 100k** | Precompute — materialized views, denormalized read models, CDN/edge. The query can't touch the source of truth. |

## 4. Compute (the jobs *over* the data)

Fuzziest axis. The real test is whether the job fits its window with room to retry.

| Rows per run | Forced |
|---|---|
| **< 10M** | Single process, cron, minutes. |
| **10M - 1B** | Parallelize by partition key. Distributed batch. Checkpointing so a failure doesn't restart from zero. |
| **> 1B** | Stop batching. Incremental or streaming aggregation, with the batch job demoted to reconciliation. |

## Named ceilings worth carrying

- **DynamoDB partition** — ~1000 writes/s, ~3000 reads/s, 10 GB
- **Single Postgres** — low thousands of inserts/s unremarkable; low tens of thousands tuned
- **Redis** — ~100k ops/s single instance; effectively free at any scale I'll be asked about
- **Kafka** — ~100k+ msg/s per broker; partition count caps consumer parallelism
- **SQS standard** — unlimited throughput, **no ordering, no partition affinity**. If a design
  needs same-key-same-consumer, standard SQS is disqualified. Cleanest reason to reach for Kafka.
- **S3** — ~3500 PUT/s per prefix. Cheap for batched appends, wrong for keyed lookup.
- **Network / disk** — 1 Gbps ≈ 125 MB/s · NVMe sequential ~1-3 GB/s
- **Availability** — 99.9% ≈ 8.8 h/yr · 99.99% ≈ 53 min/yr · 99.999% ≈ 5 min/yr

## Two things I got wrong in the rep

**Reduce volume before redistributing it.** The reflex on a hot partition is to split the key
harder. That fights a moving target — skew is customer behavior, the whale changes, and a key
narrow enough for the whale is absurdly over-split for the long tail. Pre-aggregating changes
what's being counted: write count tracks *active keys*, not events, and the skew disappears
instead of being spread. Splitting moves load; aggregating removes it.

**Past ~100k/s, exactness is what you spend.** Pre-aggregation destroys raw events, so
dedup-at-rollup stops being available — nothing left to dedup against. Redelivery duplicates are
still exact, but via offset-commit atomicity, not idempotency keys. Client-retry duplicates
arriving after the window closed are lost. Bound the error, bias it toward the customer, keep a
raw archive for disputes, and name the trade rather than claiming a guarantee I don't have.

## Drills

1. My own IoT question (50k devices, 1/min ≈ 800-1000/s): name the regime on all four axes and
   what it rules out. Then re-run at 100x and name every choice that changes.
2. "3 billion tasks/year" → peak writes/sec, in one step, out loud.
3. For any design I sketch: "this holds to roughly X; past that I'd do Y."
