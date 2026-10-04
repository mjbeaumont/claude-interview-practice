// Remove Linked List Elements.
//
// Given the head of a linked list and a value `val`, remove all nodes whose
// value equals `val` and return the new head. Removals can happen at the head,
// in the middle, in a run, or at the tail; the whole list may be removed.
//   1 -> 2 -> 6 -> 3 -> 4 -> 5 -> 6,  val = 6   becomes   1 -> 2 -> 3 -> 4 -> 5

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function removeElements(head: ListNode | null, val: number): ListNode | null {

}

// ---- test harness ----
function toList(nums: number[]): ListNode | null {
  let head: ListNode | null = null;
  for (let i = nums.length - 1; i >= 0; i--) head = new ListNode(nums[i], head);
  return head;
}
function toArray(node: ListNode | null): number[] {
  const out: number[] = [];
  while (node) { out.push(node.val); node = node.next; }
  return out;
}

const cases: [number[], number, number[]][] = [
  [[1, 2, 6, 3, 4, 5, 6], 6, [1, 2, 3, 4, 5]],
  [[], 1, []],
  [[7, 7, 7, 7], 7, []],
  [[1, 2, 3], 4, [1, 2, 3]],
  [[6, 1, 6], 6, [1]],
  [[6, 6, 1], 6, [1]],
];
for (const [nums, val, exp] of cases) {
  const got = toArray(removeElements(toList(nums), val));
  const pass = JSON.stringify(got) === JSON.stringify(exp);
  console.log(`${pass ? "✓" : "✗"} remove ${val} from ${JSON.stringify(nums)} → ${JSON.stringify(got)} (exp ${JSON.stringify(exp)})`);
}
