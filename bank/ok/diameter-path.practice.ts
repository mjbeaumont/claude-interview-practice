// Diameter of Binary Tree (LC 543).
//
// Return the length of the longest path between any two nodes. The path may or
// may not pass through the root. Length is counted in EDGES, not nodes.
//   [1,2,3,4,5]  ->  3
//   [1,2]        ->  1
//   [1]          ->  0
//   []           ->  0

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

function diameterOfBinaryTree(root: TreeNode | null): number {

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
  { vals: [1,2,3,4,5], expected: 3 },
  { vals: [1,2], expected: 1 },
  { vals: [1], expected: 0 },
  { vals: [], expected: 0 },
];

cases.forEach(({ vals, expected }) => {
  const actual = diameterOfBinaryTree(build(vals));
  const pass = actual === expected;
  console.log(`${pass ? '✓' : '✗'} diameterOfBinaryTree(${JSON.stringify(vals)}) = ${actual} (exp ${expected})`);
});
