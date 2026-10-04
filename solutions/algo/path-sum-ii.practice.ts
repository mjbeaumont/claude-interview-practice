// Path Sum II (LC 113).
//
// Return every root-to-leaf path whose values sum to targetSum.
// Each path is the list of node values from root to leaf, in order.
//   [5,4,8,11,null,13,4,7,2,null,null,5,1], 22  ->  [[5,4,11,2],[5,8,4,5]]
//   [1,2,3], 3                                  ->  [[1,2]]
//   [], 0                                       ->  []
//
// A leaf is a node with no children. Values may be negative.
// Paths are not deduplicated: two identical paths both count.

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

function pathSum(root: TreeNode | null, targetSum: number): number[][] {
  const results: number[][] = [];
  const path: number[] = [];
  function dfs(node: TreeNode | null, sum: number) {
    if (node === null) {
      return;
    }

    path.push(node.val);

    const nextNum = sum + node.val;

    if(node.left === null && node.right === null) {
      if (nextNum === targetSum) {
        results.push([...path]);
      }
    }

    dfs(node.left, nextNum);
    dfs(node.right, nextNum);

    path.pop();
  }

  dfs(root, 0);

  return results;
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

const norm = (paths: number[][]) =>
  paths && JSON.stringify([...paths].map((p) => p.join(',')).sort());

const cases: { vals: (number | null)[]; target: number; expected: number[][] }[] = [
  { vals: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], target: 22, expected: [[5, 4, 11, 2], [5, 8, 4, 5]] },
  { vals: [1, 2, 3], target: 3, expected: [[1, 2]] },
  { vals: [1, 2], target: 0, expected: [] },
  { vals: [], target: 0, expected: [] },
  { vals: [-2, null, -3], target: -5, expected: [[-2, -3]] },
  { vals: [0, 1, 1], target: 1, expected: [[0, 1], [0, 1]] },
  { vals: [1, -2, -3, 1, 3, -2, null, -1], target: -1, expected: [[1, -2, 1, -1]] },
];

cases.forEach(({ vals, target, expected }) => {
  const actual = pathSum(build(vals), target);
  const pass = norm(actual) === norm(expected);
  console.log(`${pass ? '✓' : '✗'} pathSum(${JSON.stringify(vals)}, ${target}) = ${JSON.stringify(actual)} (exp ${JSON.stringify(expected)})`);
});
