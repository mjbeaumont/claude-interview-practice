# Building blocks — what each one promises

For the moment in a system design round when I put a box on the board and they ask what it
guarantees. Companion to `SCALE_BREAKPOINTS.md`: that one says *when* a number forces a block,
this one says *what the block gives me* once it's there. Properties, not internals — I name the
guarantee I'm relying on, and the product that provides it second.

Each block: **Promises**, **Doesn't promise**, **Failure that bites**, **Reach for it when**.

## Log (Kafka, Kinesis)

**Promises**
1. Same partition key → same partition. `hash(key) % N`; many keys share a partition, N is fixed
   at topic creation.
2. Order within a partition, not across the topic.
3. Within a consumer group, one consumer owns each partition. Parallelism caps at N. One group
   per job that needs every event (aggregator, archiver, metering); instances inside a group are
   just how that job scales.
4. Offsets are committed per partition per group, so a consumer resumes where it left off — and
   a replacement picks up from the last commit after a crash.
5. Consuming doesn't delete. Events live until retention expires (time-based, 7 days default in
   Kafka), so any group can replay from an older offset, and multiple groups each read the full
   stream independently.

**Doesn't promise**
1. Exactly-once. Commit (offset) timing picks the failure: commit-then-process loses events
   (at-most-once), process-then-commit duplicates them (at-least-once). Exactly-once *effect* is
   my job — idempotent write, or offset stored in the same transaction as the result. Kafka's
   default auto-commit fires on a timer and gives neither cleanly; commit manually.
2. Even load. Partitions are balanced by count, not traffic; a hot key makes one partition (and
   one consumer) the bottleneck. Salting fixes it, at the cost of #3.
3. Per-key order survives changes. Order holds only within a key's partition — so the key must
   match the scope order matters for. Changing N remaps keys mid-stream; salting splits a key on
   purpose. Over-provision N up front; never salt a key whose order matters.

**Failure that bites**
1. Offset tracking only dedups *consumer replay*. A client that times out and retries over HTTP
   produces two real events at two distinct offsets, and offset tracking applies both. Need both
   layers: `event_id` dedup on the way in, offset-in-the-same-transaction on the way out. (Kafka's
   idempotent producer only covers producer→broker retries, not a caller re-sending.)
2. Lag past retention is silent. Expired offsets don't error — `auto.offset.reset` jumps the
   consumer (default `latest` skips to head) and it keeps running green. Monitor lag *in time*
   (age of oldest unread event). Two limits: past the freeze horizon (hours, in billing), late
   events become next-cycle adjustments — tolerable; past retention (7d), they're gone — alert
   long before. The S3 archive only helps if the backfill job exists.

**Reach for it when**
- Replay matters — reprocessing after a bug, or backfilling a consumer added later (SNS→SQS
  fan-out only delivers from subscribe time forward).
- Per-key order matters.
- Consumers need key affinity to pre-aggregate — the >100k/s breakpoint.
- Fan-out alone isn't the reason; SNS + SQS queues handles a fixed set of consumers.

**Reach for a queue instead when** work items are independent and need per-message retry/DLQ.
A log head-of-line blocks: one poison message stalls its partition, because the offset can't
skip it.

## Queue (SQS; SNS in front for fan-out)

**Promises**
1. At-least-once delivery (standard queues). Mechanism is the visibility timeout: a received
   message is hidden for T, not removed; the consumer deletes it to ack. No delete within T → it
   reappears for any consumer, receive count +1.
2. Ack deletes. Unlike a log, a consumed message is gone — no replay, no second reader. Fan-out
   means SNS in front of one queue per consumer.
3. Competing consumers. Any consumer takes any message; no ownership, no partition cap — add
   consumers freely.
4. DLQ via redrive policy: after `maxReceiveCount` receives, the message moves to a DLQ instead
   of reappearing.

**Doesn't promise**
1. Once-only processing. Duplicates come from slow consumers (timeout expiry) *and* occasionally
   from SQS itself with nothing wrong. Consumer must be idempotent, always.
2. Ordering (standard queues). Best-effort only.
3. Grouping or affinity. Any message goes to any consumer, so no consumer-side pre-aggregation —
   the store does the aggregating (atomic increments, which need dedup). FIFO `MessageGroupId`
   gives per-group order and one-at-a-time processing, but doesn't pin a group to a consumer;
   FIFO also has a lower throughput cap and a 5-minute dedup window.

**Failure that bites**
1. Slow isn't dead, but the queue can't tell. Processing past T → redelivered to a second
   consumer while the first is still working → both write. Set T above p99 processing time;
   heartbeat with `ChangeMessageVisibility` for long work.
2. DLQ counts receives, not failures. A message that times out `maxReceiveCount` times lands in
   the DLQ having never failed — a healthy message in the failure pile.

**Reach for it when**
- Work items are independent and need per-message retry/DLQ (emails, webhooks, thumbnails) — one
  poison message doesn't stall anything else.
- Fan-out to a fixed set of consumers: SNS → one queue each.
- Consumers should scale freely, with no partition cap.

**FIFO, specifically, when** per-entity order changes the result and I can't version the writes.
Test: do the operations commute? Sums do (3+5 = 5+3) — no FIFO. State changes don't
(created→deleted, opt_out→opt_in) — but the usual better fix is a version/timestamp on each change
and a conditional "only if newer" write, which makes order irrelevant on a standard queue. FIFO
earns it only when versioning is hard and throughput fits under its cap.
