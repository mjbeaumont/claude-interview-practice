// Merge Two Sorted Lists.
//
// Given the heads of two sorted linked lists, splice them together into one
// sorted list by reusing the existing nodes. Return the head of the merged
// list. Either list may be empty.
//   1 -> 2 -> 4  and  1 -> 3 -> 4   becomes   1 -> 1 -> 2 -> 3 -> 4 -> 4

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {

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

const cases: [number[], number[], number[]][] = [
  [[1, 2, 4], [1, 3, 4], [1, 1, 2, 3, 4, 4]],
  [[], [], []],
  [[], [0], [0]],
  [[1, 2, 3], [], [1, 2, 3]],
  [[5], [1, 2, 3, 4], [1, 2, 3, 4, 5]],
];
for (const [a, b, exp] of cases) {
  const got = toArray(mergeTwoLists(toList(a), toList(b)));
  const pass = JSON.stringify(got) === JSON.stringify(exp);
  console.log(`${pass ? "✓" : "✗"} ${JSON.stringify(a)} + ${JSON.stringify(b)} = ${JSON.stringify(got)} (exp ${JSON.stringify(exp)})`);
}
