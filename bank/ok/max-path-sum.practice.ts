// Binary Tree Maximum Path Sum (LC 124).
//
// A path is a sequence of nodes where each adjacent pair is connected by an edge.
// A node appears at most once, and the path need not pass through the root.
// Return the largest sum of node values over any non-empty path.
//   [1,2,3]                 ->  6
//   [-10,9,20,null,null,15,7] ->  42
//   [-3]                    ->  -3
// Constraints: 1 <= nodes <= 30000, -1000 <= val <= 1000.

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

function maxPathSum(root: TreeNode | null): number {

}

// --- quick test harness ---
function build(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0]!);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length && i < vals.length) {
    const node = queue.shift()!;
    const l = vals[i++];
    if (l !== null && l !== undefined) {
      node.left = new TreeNode(l);
      queue.push(node.left);
    }
    const r = vals[i++];
    if (r !== null && r !== undefined) {
      node.right = new TreeNode(r);
      queue.push(node.right);
    }
  }
  return root;
}

const cases: { vals: (number | null)[]; expected: number }[] = [
  { vals: [1, 2, 3], expected: 6 },
  { vals: [-10, 9, 20, null, null, 15, 7], expected: 42 },
  { vals: [-3], expected: -3 },
  { vals: [2, -1], expected: 2 },
  { vals: [-2, -1], expected: -1 },
  { vals: [-1, -2, -3], expected: -1 },
  { vals: [1, -2, 3], expected: 4 },
  { vals: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], expected: 48 },
];

cases.forEach(({ vals, expected }) => {
  const actual = maxPathSum(build(vals));
  const pass = actual === expected;
  console.log(`${pass ? '✓' : '✗'} maxPathSum(${JSON.stringify(vals)}) = ${actual} (exp ${expected})`);
});
