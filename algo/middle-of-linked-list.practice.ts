// Middle of the Linked List.
//
// Given the head of a singly linked list, return the middle node. If there are
// two middle nodes (even length), return the SECOND of the two.
//   1 -> 2 -> 3 -> 4 -> 5        middle is 3
//   1 -> 2 -> 3 -> 4 -> 5 -> 6   middle is 4 (the second of the two)

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function middleNode(head: ListNode | null): ListNode | null {

}

// ---- test harness ----
function toList(nums: number[]): ListNode | null {
  let head: ListNode | null = null;
  for (let i = nums.length - 1; i >= 0; i--) head = new ListNode(nums[i], head);
  return head;
}

const cases: [number[], number][] = [
  [[1, 2, 3, 4, 5], 3],
  [[1, 2, 3, 4, 5, 6], 4],
  [[1], 1],
  [[1, 2], 2],
  [[1, 2, 3], 2],
];
for (const [nums, exp] of cases) {
  const got = middleNode(toList(nums))?.val;
  const pass = got === exp;
  console.log(`${pass ? "✓" : "✗"} middle of ${JSON.stringify(nums)} → ${got} (exp ${exp})`);
}
