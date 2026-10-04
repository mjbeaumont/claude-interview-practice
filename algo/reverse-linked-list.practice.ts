// Reverse a Linked List.
//
// Given the head of a singly linked list, reverse the list and return the head
// of the reversed list. The list may be empty.
//   1 -> 2 -> 3 -> 4 -> 5 -> null   becomes   5 -> 4 -> 3 -> 2 -> 1 -> null

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function reverseList(head: ListNode | null): ListNode | null {

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

const cases: [number[], number[]][] = [
  [[1, 2, 3, 4, 5], [5, 4, 3, 2, 1]],
  [[1, 2], [2, 1]],
  [[42], [42]],
  [[], []],
];
for (const [input, exp] of cases) {
  const got = toArray(reverseList(toList(input)));
  const pass = JSON.stringify(got) === JSON.stringify(exp);
  console.log(`${pass ? "✓" : "✗"} ${JSON.stringify(input)} → ${JSON.stringify(got)} (exp ${JSON.stringify(exp)})`);
}
