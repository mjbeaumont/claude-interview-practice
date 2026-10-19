// Binary Tree Vertical Order Traversal (LC 314).
//
// Given the root of a binary tree, return its values grouped by column, from the
// leftmost column to the rightmost. The root is in column 0. A left child is one
// column left of its parent and a right child is one column right.
// Within a column, list values from top to bottom. If two nodes share a column
// and a row, the one further left comes first.
//   [3,9,20,null,null,15,7]  ->  [[9],[3,15],[20],[7]]
//   [3,1,4,0,2,2]            ->  [[0],[1],[3,2,2],[4]]
//   []                       ->  []
// Constraints: 0 <= nodes <= 100.

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

function verticalOrder(root: TreeNode | null): number[][] {

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

const cases: { vals: (number | null)[]; expected: number[][] }[] = [
  { vals: [3, 9, 20, null, null, 15, 7], expected: [[9], [3, 15], [20], [7]] },
  { vals: [3, 1, 4, 0, 2, 2], expected: [[0], [1], [3, 2, 2], [4]] },
  { vals: [], expected: [] },
  { vals: [1], expected: [[1]] },
  { vals: [1, 2, null, 3], expected: [[3], [2], [1]] },
  { vals: [1, null, 2, null, 3], expected: [[1], [2], [3]] },
  { vals: [1, 2, 3, null, 4, null, null, null, 5], expected: [[2], [1, 4], [3, 5]] },
];

cases.forEach(({ vals, expected }) => {
  const actual = verticalOrder(build(vals));
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? '✓' : '✗'} verticalOrder(${JSON.stringify(vals)}) = ${JSON.stringify(actual)} (exp ${JSON.stringify(expected)})`);
});
