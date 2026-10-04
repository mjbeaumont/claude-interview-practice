# System design primitives

The building blocks that composite system-design/LLD questions (notification system, newsfeed,
URL shortener, rate limiter...) get assembled from. Coding-round patterns have NeetCode; these
don't have an equivalent drill set, so this is that list.

## Rating scale — and how ratings get set

**A rating only moves up after I've verified it in conversation** — by asking you to explain the
tradeoff cold, or derive it from the underlying problem — not by you self-reporting. Self-rating
just launders "I feel okay about this" into a checkmark; the point of this doc is to catch where
that feeling is wrong.

- **1 — Blank.** Recognize the term at best. No model of why it exists.
- **2 — Recall.** Can define it and name the alternative it's contrasted with, but can't yet say
  *when* to pick one over the other, or why.
- **3 — Explain.** Can state the tradeoff unprompted and pick correctly for a given scenario
  ("read-heavy + celebrity accounts → fan-out-on-read").
- **4 — Defend.** All of 3, plus survives a follow-up curveball without going blank (interviewer
  changes a constraint mid-answer — "what if writes need to be strongly consistent?").

Target for interview-readiness: **3 everywhere, 4 on whatever's come up before in your actual
loops.** A 4 on everything isn't the goal — that's over-rotating on breadth you won't be asked for.

Fill the tables below by asking me to quiz you category by category — I'll pick the scenario, you
answer, I set the rating. Don't pre-fill these yourself.

## API / communication style

| Primitive | Rating (1-4) | Notes |
|---|---|---|
| REST vs GraphQL vs gRPC — decision criteria, not familiarity | | |
| Sync (req/resp) vs async delivery: webhook, polling, long-polling, SSE, WebSockets | | |
| Idempotency keys — why POST needs one, PUT/GET don't | | |

## Querying at scale

| Primitive | Rating (1-4) | Notes |
|---|---|---|
| Offset pagination vs cursor/keyset pagination | | |
| Full-text search / inverted index — when a DB `LIKE` stops being viable | | |

## Concurrency & execution model

| Primitive | Rating (1-4) | Notes |
|---|---|---|
| Concurrency vs parallelism | | |
| Threads vs processes; async I/O vs multi-threading | | |
| Race conditions, locks/mutexes, optimistic vs pessimistic concurrency control | | |

## Async messaging

| Primitive | Rating (1-4) | Notes |
|---|---|---|
| Message queue (point-to-point) vs pub/sub (fan-out) | | |
| Log-based streaming (Kafka/Kinesis) vs queue vs pub/sub — partitions, offsets, retention, consumer groups | | |
| Delivery guarantees: at-most-once / at-least-once / exactly-once | | |
| Dead-letter queues; retry with exponential backoff | | |

## Data layer

| Primitive | Rating (1-4) | Notes |
|---|---|---|
| SQL vs NoSQL — decide from access pattern, not "scales better" | | |
| Replication: leader-follower, read replicas, replication lag | | |
| Sharding/partitioning — shard key choice, hot-shard problem | | |
| Consistency models: strong vs eventual; CAP theorem | | |
| ACID vs BASE | | |

## Caching

| Primitive | Rating (1-4) | Notes |
|---|---|---|
| Cache-aside vs write-through vs write-back | | |
| Eviction: LRU vs LFU vs TTL | | |
| Invalidation | | |
| CDN vs application cache (Redis) vs DB query cache | | |

## Scaling & traffic shaping

| Primitive | Rating (1-4) | Notes |
|---|---|---|
| Horizontal vs vertical scaling; why statelessness enables horizontal | | |
| Load balancing: L4 vs L7; round-robin vs consistent hashing | | |
| Rate limiting: token bucket vs fixed-window vs sliding-window counter | | |
| Fan-out-on-write vs fan-out-on-read | | |

## IDs & resilience primitives

| Primitive | Rating (1-4) | Notes |
|---|---|---|
| UUID vs auto-increment vs Snowflake-style distributed ID generation | | |
| Circuit breakers | | |
| Retries with backoff + jitter | | |
</content>
