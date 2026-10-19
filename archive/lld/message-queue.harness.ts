import { MessageQueue } from './message-queue.practice.ts';

let passed = 0;
let failed = 0;

function check(label: string, actual: unknown, expected: unknown) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  if (pass) passed++;
  else failed++;
  console.log(`${pass ? '✓' : '✗'} ${label} -> ${JSON.stringify(actual)} (exp ${JSON.stringify(expected)})`);
}

const TIMEOUT = 10;
const RETRIES = 2;

function textOf(m: { text: string } | null): string | null {
  return m === null ? null : m?.text;
}

// ===== rung 1: basic delivery (all acknowledged, so no redelivery) =====

// --- empty ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  check('dequeue on a new queue returns null', q.dequeue(0), null);
}

// --- single message ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  const id = q.enqueue('a', 1);
  const m = q.dequeue(1);
  check('dequeue returns the message text', textOf(m), 'a');
  check('dequeue returns the id that enqueue returned', m?.id, id);
  check('dequeue returns the sent_at', m?.sent_at, 1);
  q.acknowledge(id);
  check('an acknowledged message is gone', q.dequeue(1), null);
}

// --- ids ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  const ids = new Set<number>();
  for (let i = 0; i < 100; i++) ids.add(q.enqueue(`m${i}`, i));
  check('100 enqueues return 100 distinct ids', ids.size, 100);
}

// --- order ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  q.enqueue('a', 1);
  q.enqueue('b', 2);
  q.enqueue('c', 3);
  const out: (string | null)[] = [];
  for (let i = 0; i < 3; i++) {
    const m = q.dequeue(3);
    out.push(textOf(m));
    if (m) q.acknowledge(m.id);
  }
  check('messages come out in the order they went in', out, ['a', 'b', 'c']);
  check('drained queue returns null', q.dequeue(3), null);
}

// --- same content twice ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  const id1 = q.enqueue('dup', 1);
  const id2 = q.enqueue('dup', 2);
  check('identical text gets distinct ids', id1 !== id2, true);
  const m1 = q.dequeue(2);
  const m2 = q.dequeue(2);
  check('identical text: both copies delivered', [textOf(m1), textOf(m2)], ['dup', 'dup']);
}

// --- independent queues ---
{
  const q1 = new MessageQueue(TIMEOUT, RETRIES);
  const q2 = new MessageQueue(TIMEOUT, RETRIES);
  q1.enqueue('one', 1);
  check('a second queue does not see the first queue', q2.dequeue(1), null);
  check('the first queue keeps its message', textOf(q1.dequeue(1)), 'one');
}

// ===== rung 2: acknowledgment and redelivery =====

// --- in flight is invisible ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  q.enqueue('a', 0);
  q.dequeue(0);
  check('an unacknowledged message is invisible inside the timeout', q.dequeue(5), null);
  check('still invisible just before the timeout', q.dequeue(TIMEOUT - 1), null);
}

// --- redelivery after timeout ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  const id = q.enqueue('a', 0);
  q.dequeue(0);
  const again = q.dequeue(TIMEOUT + 1);
  check('an unacknowledged message comes back after the timeout', textOf(again), 'a');
  check('the redelivered message keeps its id', again?.id, id);
  check('the redelivered message keeps its sent_at', again?.sent_at, 0);
  check('it is delivered once per timeout, not twice', q.dequeue(TIMEOUT + 1), null);
}

// --- acknowledged is never redelivered ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  const id = q.enqueue('a', 0);
  q.dequeue(0);
  q.acknowledge(id);
  check('an acknowledged message never comes back', q.dequeue(TIMEOUT * 100), null);
}

// --- redelivered message gets a fresh timeout ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  q.enqueue('a', 0);
  q.dequeue(0);
  q.dequeue(20); // second delivery at t=20
  check('second delivery: invisible inside its own timeout', q.dequeue(25), null);
  check('second delivery: comes back after its own timeout', textOf(q.dequeue(20 + TIMEOUT + 1)), 'a');
}

// --- acknowledge after redelivery ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  const id = q.enqueue('a', 0);
  q.dequeue(0);
  q.dequeue(TIMEOUT + 1);
  q.acknowledge(id);
  check('acknowledging the second delivery removes the message', q.dequeue(TIMEOUT * 100), null);
}

// --- in flight does not block others ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  q.enqueue('a', 0);
  q.enqueue('b', 0);
  q.dequeue(0);
  check('the next message is delivered while the first is in flight', textOf(q.dequeue(1)), 'b');
  check('both in flight: nothing visible', q.dequeue(2), null);
}

// --- ack one of two in flight ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  const idA = q.enqueue('a', 0);
  q.enqueue('b', 0);
  q.dequeue(0);
  q.dequeue(0);
  q.acknowledge(idA);
  check('only the unacknowledged message comes back', textOf(q.dequeue(TIMEOUT + 1)), 'b');
  check('and nothing else', q.dequeue(TIMEOUT + 1), null);
}

// --- new messages still flow while old ones are in flight ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  q.enqueue('a', 0);
  q.dequeue(0);
  q.enqueue('b', 3);
  check('a message enqueued later is delivered during the timeout', textOf(q.dequeue(3)), 'b');
}

// --- acknowledge edge calls do not throw ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  let threw = false;
  try {
    q.acknowledge(12345);
  } catch {
    threw = true;
  }
  check('acknowledging an unknown id does not throw', threw, false);

  const id = q.enqueue('a', 0);
  q.dequeue(0);
  threw = false;
  try {
    q.acknowledge(id);
    q.acknowledge(id);
  } catch {
    threw = true;
  }
  check('acknowledging twice does not throw', threw, false);
}

// --- volume: acknowledged in order ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  const n = 10_000;
  for (let i = 0; i < n; i++) q.enqueue(`m${i}`, 0);
  let outOfOrder = 0;
  for (let i = 0; i < n; i++) {
    const m = q.dequeue(0);
    if (textOf(m) !== `m${i}`) outOfOrder++;
    if (m) q.acknowledge(m.id);
  }
  check(`${n} messages come out in order`, outOfOrder, 0);
  check(`${n} acknowledged messages never come back`, q.dequeue(TIMEOUT * 100), null);
}


// --- volume: none acknowledged, all come back exactly once ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  const n = 10_000;
  const ids = new Set<number>();
  for (let i = 0; i < n; i++) ids.add(q.enqueue(`m${i}`, 0));
  for (let i = 0; i < n; i++) q.dequeue(0);

  const back = new Set<number>();
  let duplicates = 0;
  for (let i = 0; i < n; i++) {
    const m = q.dequeue(TIMEOUT + 1);
    if (!m) break;
    if (back.has(m.id)) duplicates++;
    back.add(m.id);
  }
  let missing = 0;
  for (const id of ids) if (!back.has(id)) missing++;
  check(`${n} unacknowledged: none lost`, missing, 0);
  check(`${n} unacknowledged: none duplicated`, duplicates, 0);
  check(`${n} unacknowledged: nothing extra`, q.dequeue(TIMEOUT + 1), null);
}

// ===== rung 3: dead letter queue =====

// deliver-and-never-ack: advance past each timeout and count deliveries
function deliveriesUntilGone(q: MessageQueue, maxRounds: number): number {
  let deliveries = 0;
  for (let round = 0; round < maxRounds; round++) {
    const m = q.dequeue(round * (TIMEOUT + 1));
    if (m !== null) deliveries++;
  }
  return deliveries;
}

// --- empty dead letter queue ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  check('dead letter queue on a new queue returns null', q.dequeueDLQ(), null);
}

// --- retries = 2 means 3 deliveries ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  const id = q.enqueue('poison', 0);
  check('retries=2: consumer receives the message 3 times', deliveriesUntilGone(q, 10), 3);
  const dead = q.dequeueDLQ();
  check('the message lands in the dead letter queue', textOf(dead), 'poison');
  check('the dead message keeps its id', dead?.id, id);
  check('the dead message keeps its sent_at', dead?.sent_at, 0);
  check('the dead letter queue gives each message once', q.dequeueDLQ(), null);
  check('the main queue never delivers it again', q.dequeue(TIMEOUT * 100), null);
}

// --- not dead before the last timeout expires ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  q.enqueue('poison', 0);
  q.dequeue(0);
  q.dequeue(TIMEOUT + 1);
  q.dequeue(2 * (TIMEOUT + 1)); // third delivery, still in flight
  q.dequeue(2 * (TIMEOUT + 1) + 5);
  check('in flight on its last delivery: not in the dead letter queue yet', q.dequeueDLQ(), null);
}

// --- retries = 0 ---
{
  const q = new MessageQueue(TIMEOUT, 0);
  q.enqueue('once', 0);
  check('retries=0: consumer receives the message once', deliveriesUntilGone(q, 10), 1);
  check('retries=0: then it is dead', textOf(q.dequeueDLQ()), 'once');
}

// --- retries = 5 ---
{
  const q = new MessageQueue(TIMEOUT, 5);
  q.enqueue('six', 0);
  check('retries=5: consumer receives the message 6 times', deliveriesUntilGone(q, 20), 6);
  check('retries=5: then it is dead', textOf(q.dequeueDLQ()), 'six');
}

// --- acknowledged on the last delivery ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  const id = q.enqueue('late', 0);
  q.dequeue(0);
  q.dequeue(TIMEOUT + 1);
  q.dequeue(2 * (TIMEOUT + 1));
  q.acknowledge(id);
  q.dequeue(TIMEOUT * 100);
  check('acknowledged on the last delivery: never dead', q.dequeueDLQ(), null);
}

// --- acknowledged on the first delivery ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  const id = q.enqueue('fine', 0);
  q.dequeue(0);
  q.acknowledge(id);
  q.dequeue(TIMEOUT * 100);
  check('acknowledged on the first delivery: never dead', q.dequeueDLQ(), null);
}

// --- a dying message does not block healthy ones ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  q.enqueue('poison', 0);
  q.dequeue(0);
  const idH = q.enqueue('healthy', 1);
  const h = q.dequeue(1);
  check('a healthy message is delivered while the poison one is in flight', textOf(h), 'healthy');
  q.acknowledge(idH);
  deliveriesUntilGone(q, 10);
  const dead = q.dequeueDLQ();
  check('only the poison message is dead', textOf(dead), 'poison');
  check('and nothing else is dead', q.dequeueDLQ(), null);
}

// --- volume: ack the even ids, never ack the odd ids ---
{
  const q = new MessageQueue(TIMEOUT, RETRIES);
  const n = 1000;
  const oddIds = new Set<number>();
  for (let i = 0; i < n; i++) {
    const id = q.enqueue(`m${i}`, 0);
    if (i % 2 === 1) oddIds.add(id);
  }
  const deliveries = new Map<number, number>();
  for (let round = 0; round < 10; round++) {
    const t = round * (TIMEOUT + 1);
    let m = q.dequeue(t);
    while (m) {
      deliveries.set(m.id, (deliveries.get(m.id) ?? 0) + 1);
      if (!oddIds.has(m.id)) q.acknowledge(m.id);
      m = q.dequeue(t);
    }
  }

  let wrongCount = 0;
  for (const [id, count] of deliveries) {
    const expected = oddIds.has(id) ? RETRIES + 1 : 1;
    if (count !== expected) wrongCount++;
  }
  check(`${n}: every message delivered`, deliveries.size, n);
  check(`${n}: acked once, unacked ${RETRIES + 1} times`, wrongCount, 0);

  const dead = new Set<number>();
  let deadDuplicates = 0;
  let deadWrong = 0;
  let d = q.dequeueDLQ();
  while (d) {
    if (dead.has(d.id)) deadDuplicates++;
    if (!oddIds.has(d.id)) deadWrong++;
    dead.add(d.id);
    d = q.dequeueDLQ();
  }
  check(`${n}: every unacked message is dead`, dead.size, oddIds.size);
  check(`${n}: no acked message is dead`, deadWrong, 0);
  check(`${n}: no dead duplicates`, deadDuplicates, 0);
}

console.log(`\n${passed} passed, ${failed} failed`);
