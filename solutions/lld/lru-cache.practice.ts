// LRU Cache — LLD practice
//
// Design a Least Recently Used (LRU) cache.
//   get(key): return the value if key exists, else -1. Counts as a "use".
//   put(key, value): insert or update. If adding a new key would exceed
//   capacity, evict the least recently used entry first.
// Both operations must run in O(1).

class ListNode {
  key: number;
  val: number;
  next: ListNode;
  prev: ListNode;

  constructor(key: number, val: number) {
    this.key = key;
    this.val = val;
    this.next = this;
    this.prev = this;
  }
}

class RecencyList {
  head: ListNode;
  
  constructor() {
    this.head = new ListNode(-1, -1);
  }

  pushFront(node: ListNode) {
    this._insertBetween(node, this.head, this.head.next);
  }

  moveFront(node: ListNode) {
    this._unlink(node);
    this.pushFront(node);
  }

  popBack(): ListNode | undefined {
    const lastNode = this.head.prev;
    if (lastNode === this.head) {
      return undefined;
    }

    this._unlink(lastNode);
    return lastNode;
  }

  _insertBetween(node: ListNode, prev: ListNode, next: ListNode) {
    node.next = next;
    node.prev = prev;
    node.prev.next = node;
    node.next.prev = node;
  }

  _unlink(node: ListNode) {
    node.next.prev = node.prev;
    node.prev.next = node.next;
    node.next = node;
    node.prev = node;
  }
}

class LinkedHashMap {
  lookup: Map<number, ListNode>;
  recencyList: RecencyList;

  constructor() {
    this.lookup = new Map();
    this.recencyList = new RecencyList();
  }

  touch(node: ListNode): void {
    this.recencyList.moveFront(node);
  }

  get(key: number): ListNode | undefined {
    return this.lookup.get(key);
  }

  set(key: number, val: number) {
    const entry = this.get(key);
    if (entry !== undefined) {
      entry.val = val;
      this.recencyList.moveFront(entry);
      return;
    }

    const nextEntry = new ListNode(key, val);
    this.lookup.set(key, nextEntry);
    this.recencyList.pushFront(nextEntry);
  }

  evictLast() {
    const lastNode = this.recencyList.popBack();
    if(lastNode !== undefined) {
      this.lookup.delete(lastNode.key);
    }
  }

  size() {
    return this.lookup.size;
  }
}

class LRUCache {
  storage: LinkedHashMap;
  capacity: number;

  constructor(capacity: number) {
    this.storage = new LinkedHashMap();
    this.capacity = capacity;
  }

  get(key: number): number {
    const existing = this.storage.get(key); 
    if (existing === undefined) {
      return -1;
    }

    this.storage.touch(existing);
    return existing.val;
  }

  put(key: number, val: number): void {
    this.storage.set(key, val);

    if (this.storage.size() > this.capacity) {
      this.storage.evictLast();
    }
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
