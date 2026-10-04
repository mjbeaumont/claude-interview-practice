// LRU Cache — LLD practice
//
// Design a Least Recently Used (LRU) cache that holds at most `capacity` entries.
//   get(key): return the value if key exists, else -1. A successful get counts
//     as a "use" of that key.
//   put(key, value): insert the key, or update its value if it already exists.
//     Either way it counts as a "use". If inserting a new key would exceed
//     capacity, evict the least recently used entry first.
// Both operations must run in O(1).

class LRUCache {
  constructor(capacity: number) {

  }

  get(key: number): number {

  }

  put(key: number, val: number): void {

  }
}

// ---- test harness ----
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);

const g1 = cache.get(1);
console.log(`${g1 === 1 ? "✓" : "✗"} get(1) = ${g1} (exp 1)`);

cache.put(3, 3); // capacity 2 exceeded -> evicts key 2 (least recently used)

const g2 = cache.get(2);
console.log(`${g2 === -1 ? "✓" : "✗"} get(2) = ${g2} (exp -1)`);

cache.put(4, 4); // evicts key 1

const g1b = cache.get(1);
console.log(`${g1b === -1 ? "✓" : "✗"} get(1) = ${g1b} (exp -1)`);

const g3 = cache.get(3);
console.log(`${g3 === 3 ? "✓" : "✗"} get(3) = ${g3} (exp 3)`);

const g4 = cache.get(4);
console.log(`${g4 === 4 ? "✓" : "✗"} get(4) = ${g4} (exp 4)`);
