class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  let c1 = l1;
  let c2 = l2;

  let head: ListNode | null = null;
  let tail: ListNode | null = null;

  let remainder: number = 0;

  while (c1 || c2 || remainder) {
    const n1: number = c1 ? c1.val : 0;
    const n2: number = c2 ? c2.val : 0;
    let val: number = 0;

    const sum = n1 + n2 + remainder;
    remainder = 0;

    if (sum < 10) {
      val = sum;
      remainder = 0;
    } else {
      val = sum - 10;
      remainder = 1;
    }

    const node = new ListNode(val);
    if (!head) {
      head = tail = node;
    } else if(tail) {
      tail.next = node;
      tail = node;
    }

    c1 = c1?.next ?? null; 
    c2 = c2?.next ?? null; 
  }

  return head;

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
