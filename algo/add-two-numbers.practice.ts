// Add Two Numbers.
//
// Two non-empty linked lists represent two non-negative integers. The digits
// are stored in REVERSE order (least-significant digit first), one digit per
// node. Add the two numbers and return the sum as a linked list, same format.
// No leading zeros except the number 0 itself. Lists may differ in length.

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {

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
  [[2, 4, 3], [5, 6, 4], [7, 0, 8]],   // 342 + 465 = 807
  [[0], [0], [0]],
  [[9, 9, 9], [1], [0, 0, 0, 1]],       // 999 + 1 = 1000, carry chains
  [[9, 9], [9, 9, 9, 9], [8, 9, 0, 0, 1]], // different lengths
];
for (const [a, b, exp] of cases) {
  const got = toArray(addTwoNumbers(toList(a), toList(b)));
  const pass = JSON.stringify(got) === JSON.stringify(exp);
  console.log(`${pass ? "✓" : "✗"} ${JSON.stringify(a)} + ${JSON.stringify(b)} = ${JSON.stringify(got)} (exp ${JSON.stringify(exp)})`);
}
