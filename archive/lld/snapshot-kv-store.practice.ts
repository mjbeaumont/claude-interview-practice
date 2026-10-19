// Snapshot KV Store — LLD practice
//
// A key-value store (string keys, number values) that can be read "as of" a
// past point in time. Built in three stages:
//
// 1. Versioned reads
//    set(key, value): write to the current live state. Several writes to the
//      same key with no snapshot between them: the last write wins.
//    snapshot(): freeze the current state and return its id. Ids start at 0
//      and increase by one per call.
//    get(key, snapshotId): the value key held at the instant that snapshot was
//      taken, or -1 if key had not been set yet at that point.
//    A key written once and never touched again must read back from every
//    later snapshot. set() must not copy the store.
//
// 2. Deletes
//    delete(key): remove key from the live state. Snapshots taken while it was
//      deleted read -1; snapshots taken before the delete still see the old
//      value; a later set() brings it back. Deleting a key that was never set
//      is allowed. Within one window (between two snapshots), set/delete
//      sequences resolve by last write wins.
//
// 3. Release (reclaiming memory)
//    release(snapshotId): the caller is done with that snapshot. Reading a
//      released id afterwards is caller error (never tested).
//    Reclamation follows a horizon rule. Let H = the lowest snapshot id that is
//    still live (not released); if nothing is live, H is the current, not yet
//    snapshotted, window. For each key, keep the version that a read at H
//    would see, plus every newer version; drop every older version. A key's
//    newest version is never dropped. Releasing an id that is not the lowest
//    live one cannot move H, so it frees nothing.
//    The release tests count retained versions by reading the store's
//    `liveCache` field: a Map from key to an array with one element per
//    retained version of that key.
//
// Target: get() sublinear in the number of snapshots. set() O(1).

class SnapshotStore {
  liveCache: Map<string, unknown[]>;

  constructor() {

  }

  set(key: string, value: number): void {

  }

  delete(key: string): void {

  }

  release(snapshotId: number): void {

  }

  snapshot(): number {

  }

  get(key: string, snapshotId: number): number {

  }
}

// ---- test harness ----
const store = new SnapshotStore();

store.set("a", 1);
store.set("b", 10);
const s0 = store.snapshot();

store.set("a", 2);
const s1 = store.snapshot();

store.set("a", 3);
store.set("c", 100);
const s2 = store.snapshot();

const cases: [string, number, number][] = [
  ["a", s0, 1],    // value at first snapshot
  ["a", s1, 2],    // overwritten between snapshots
  ["a", s2, 3],
  ["b", s0, 10],
  ["b", s2, 10],   // written once, reads through every later snapshot
  ["c", s0, -1],   // not yet set at s0
  ["c", s1, -1],
  ["c", s2, 100],
  ["zz", s1, -1],  // never set at all
];

console.log(`${s0 === 0 && s1 === 1 && s2 === 2 ? "✓" : "✗"} snapshot ids = ${s0},${s1},${s2} (exp 0,1,2)`);

for (const [key, snap, expected] of cases) {
  const actual = store.get(key, snap);
  console.log(`${actual === expected ? "✓" : "✗"} get(${key}, ${snap}) = ${actual} (exp ${expected})`);
}

// multiple writes with no snapshot between them: last write wins
const s3 = store.snapshot();
store.set("d", 1);
store.set("d", 2);
store.set("d", 3);
const s4 = store.snapshot();

const d3 = store.get("d", s3);
console.log(`${d3 === -1 ? "✓" : "✗"} get(d, ${s3}) = ${d3} (exp -1)`);
const d4 = store.get("d", s4);
console.log(`${d4 === 3 ? "✓" : "✗"} get(d, ${s4}) = ${d4} (exp 3)`);

// ---- delete cases ----
const st2 = new SnapshotStore();

st2.set("x", 5);
const t0 = st2.snapshot();

st2.delete("x");
const t1 = st2.snapshot();

st2.set("x", 7);
const t2 = st2.snapshot();

st2.delete("y");
st2.set("z", 1);
st2.delete("z");
const t3 = st2.snapshot();

st2.set("w", 1);
st2.delete("w");
st2.set("w", 2);
const t4 = st2.snapshot();

const delCases: [string, number, number][] = [
  ["x", t0, 5],    // before the delete
  ["x", t1, -1],   // deleted
  ["x", t2, 7],    // re-set after delete
  ["y", t3, -1],   // deleted without ever being set
  ["y", t0, -1],   // delete does not leak backwards
  ["z", t3, -1],   // set then deleted, same snapshot window
  ["z", t2, -1],   // not yet touched at t2
  ["w", t4, 2],    // set, delete, set within one window: last write wins
  ["w", t3, -1],   // not yet touched at t3
];

for (const [key, snap, expected] of delCases) {
  const actual = st2.get(key, snap);
  console.log(`${actual === expected ? "✓" : "✗"} del: get(${key}, ${snap}) = ${actual} (exp ${expected})`);
}

// ---- release cases (horizon semantics) ----
// Reclamation rule under test:
//   horizon H = lowest still-live snapshot id (parks at the current window when
//   nothing is live). For each key, the entry H reads is the anchor; everything
//   below the anchor is unreachable and gets dropped. A release of an id that is
//   not the lowest cannot move any anchor, so it frees nothing.
// Reading a released id is caller error — never asserted below.

function entryCount(s: SnapshotStore): number {
  const cache = (s as any).liveCache;
  if (!cache) return NaN;
  let n = 0;
  for (const entries of cache.values()) n += entries.length;
  return n;
}
function chk(label: string, actual: unknown, expected: unknown) {
  console.log(`${actual === expected ? "✓" : "✗"} ${label} = ${actual} (exp ${expected})`);
}

// scenario 1: every window overwrites the key; horizon walks the whole range
const r1 = new SnapshotStore();
r1.set("a", 1); const p0 = r1.snapshot();
r1.set("a", 2); const p1 = r1.snapshot();
r1.set("a", 3); const p2 = r1.snapshot();
r1.set("a", 4); const p3 = r1.snapshot();

chk("rel s1: entries before", entryCount(r1), 4);
r1.release(p1);                                       // 1 is not the lowest (0 is)
chk("rel s1: release(1) frees nothing", entryCount(r1), 4);
chk("rel s1: get(a,0)", r1.get("a", p0), 1);
chk("rel s1: get(a,2)", r1.get("a", p2), 3);
chk("rel s1: get(a,3)", r1.get("a", p3), 4);
r1.release(p0);                                       // horizon 0 -> 2, anchor = s2
chk("rel s1: after release(0)", entryCount(r1), 2);
chk("rel s1: get(a,2) unchanged", r1.get("a", p2), 3);
chk("rel s1: get(a,3) unchanged", r1.get("a", p3), 4);
r1.release(p2);                                       // horizon 2 -> 3, anchor = s3
chk("rel s1: after release(2)", entryCount(r1), 1);
chk("rel s1: get(a,3) unchanged", r1.get("a", p3), 4);
r1.release(p3);                                       // nothing live; last entry survives
chk("rel s1: after release(3)", entryCount(r1), 1);

// scenario 2: one entry spans several windows; anchor only moves when H clears the span
const r2 = new SnapshotStore();
r2.set("b", 1); const q0 = r2.snapshot();
const q1 = r2.snapshot();
const q2 = r2.snapshot();
r2.set("b", 2); const q3 = r2.snapshot();

chk("rel s2: entries before", entryCount(r2), 2);
r2.release(q0);                                       // H 0 -> 1, anchor still s0
chk("rel s2: after release(0)", entryCount(r2), 2);
chk("rel s2: get(b,1)", r2.get("b", q1), 1);
r2.release(q2);                                       // 2 is not the lowest
chk("rel s2: after release(2)", entryCount(r2), 2);
chk("rel s2: get(b,1) unchanged", r2.get("b", q1), 1);
r2.release(q1);                                       // H 1 -> 3, anchor = s3
chk("rel s2: after release(1)", entryCount(r2), 1);
chk("rel s2: get(b,3)", r2.get("b", q3), 2);

// scenario 3: two keys, releases out of order, one sweep must touch both keys
const r3 = new SnapshotStore();
r3.set("m", 1); r3.set("n", 100); const v0 = r3.snapshot();
r3.set("m", 2); const v1 = r3.snapshot();
r3.set("m", 3); const v2 = r3.snapshot();
r3.set("n", 200); const v3 = r3.snapshot();

chk("rel s3: entries before", entryCount(r3), 5);
r3.release(v2);                                       // not the lowest
chk("rel s3: after release(2)", entryCount(r3), 5);
r3.release(v0);                                       // H 0 -> 1; m drops s0, n untouched
chk("rel s3: after release(0)", entryCount(r3), 4);
chk("rel s3: get(m,1)", r3.get("m", v1), 2);
chk("rel s3: get(n,1)", r3.get("n", v1), 100);
r3.release(v1);                                       // H 1 -> 3; m drops s1, n drops s0
chk("rel s3: after release(1)", entryCount(r3), 2);
chk("rel s3: get(m,3)", r3.get("m", v3), 3);
chk("rel s3: get(n,3)", r3.get("n", v3), 200);

// scenario 4: a stuck low handle pins everything (the bloat case)
const r4 = new SnapshotStore();
const w0 = r4.snapshot();
const w1 = r4.snapshot();                             // long-running reader holds this one
const w2 = r4.snapshot();
const w3 = r4.snapshot();
const w4 = r4.snapshot();
r4.set("a", 1); const w5 = r4.snapshot();
r4.set("a", 2); const w6 = r4.snapshot();

chk("rel s4: entries before", entryCount(r4), 2);
r4.release(w0);                                       // H 0 -> 1, pinned there by w1
r4.release(w2); r4.release(w3); r4.release(w4);
chk("rel s4: pinned by the low handle", entryCount(r4), 2);
r4.release(w5);                                       // s5 is genuinely dead, but H is still 1
chk("rel s4: horizon rule reclaims nothing", entryCount(r4), 2);
chk("rel s4: get(a,6)", r4.get("a", w6), 2);
r4.release(w1);                                       // H 1 -> 6, anchor = s6
chk("rel s4: after the low handle goes", entryCount(r4), 1);
chk("rel s4: get(a,6) unchanged", r4.get("a", w6), 2);
