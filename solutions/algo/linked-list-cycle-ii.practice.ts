// Linked List Cycle II.
//
// Given the head of a linked list, return the node where the cycle begins.
// If there is no cycle, return null. Do NOT modify the list, and solve it in
// O(1) extra space (no set of visited nodes).
//   3 -> 2 -> 0 -> -4 -> (back to 2)   entry is the node with val 2
//   1 -> 2 -> (back to 1)              entry is the node with val 1
//   1 -> (no cycle)                    returns null

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function detectCycle(head: ListNode | null): ListNode | null {
  let cycleDetected: boolean = false;
  if (head === null) return null;

  let slow: ListNode | null = head; 
  let fast: ListNode | null = head; 

  while(fast && fast.next) {
     slow = slow?.next ?? null;
     fast = fast.next?.next ?? null;
     if (slow === fast) {
      cycleDetected = true;
      break;
     }
  }

  if (!cycleDetected) {
     return null;
  }

  slow = head;

  while(slow !== fast) {
    slow = slow?.next ?? null; 
    fast = fast?.next ?? null;
  }
  
  return slow;
}

// ---- test harness ----
// Builds nums into a list; if pos >= 0, the tail's `next` points back to the
// node at index pos, creating a cycle. Returns [head, entryNode | null].
function buildList(nums: number[], pos: number): [ListNode | null, ListNode | null] {
  if (nums.length === 0) return [null, null];

  const nodes = nums.map((n) => new ListNode(n));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];

  const entry = pos >= 0 ? nodes[pos] : null;
  if (entry) nodes[nodes.length - 1].next = entry;

  return [nodes[0], entry];
}

const cases: [number[], number][] = [
  [[3, 2, 0, -4], 1],
  [[1, 2], 0],
  [[1], -1],
  [[1, 2, 3, 4, 5], -1],
  [[1], 0],
];
for (const [nums, pos] of cases) {
  const [head, expected] = buildList(nums, pos);
  const got = detectCycle(head);
  const pass = got === expected;
  console.log(`${pass ? "✓" : "✗"} ${JSON.stringify(nums)} pos=${pos} → ${got ? got.val : null} (exp ${expected ? expected.val : null})`);
}
