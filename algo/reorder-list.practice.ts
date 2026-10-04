// Reorder List.
//
// Given the head of a singly linked list L0 -> L1 -> ... -> Ln-1 -> Ln,
// reorder it in place to:
//   L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...
// You may not modify the values in the list's nodes, only the node links.
//   1 -> 2 -> 3 -> 4          becomes  1 -> 4 -> 2 -> 3
//   1 -> 2 -> 3 -> 4 -> 5     becomes  1 -> 5 -> 2 -> 4 -> 3

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function reorderList(head: ListNode | null): void {

}

// ---- test harness ----
function toList(nums: number[]): ListNode | null {
  let head: ListNode | null = null;
  for (let i = nums.length - 1; i >= 0; i--) head = new ListNode(nums[i], head);
  return head;
}

function toArray(head: ListNode | null): number[] {
  const out: number[] = [];
  while (head) {
    out.push(head.val);
    head = head.next;
  }
  return out;
}

const cases: [number[], number[]][] = [
  [[1], [1]],
  [[1, 2], [1, 2]],
  [[1, 2, 3], [1, 3, 2]],
  [[1, 2, 3, 4], [1, 4, 2, 3]],
  [[1, 2, 3, 4, 5], [1, 5, 2, 4, 3]],
];
for (const [nums, exp] of cases) {
  const head = toList(nums);
  reorderList(head);
  const got = toArray(head);
  const pass = JSON.stringify(got) === JSON.stringify(exp);
  console.log(`${pass ? "✓" : "✗"} reorderList(${JSON.stringify(nums)}) → ${JSON.stringify(got)} (exp ${JSON.stringify(exp)})`);
}
