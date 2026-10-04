// Longest Univalue Path (LC 687).
//
// Return the length of the longest path where every node on the path has the
// same value. The path may or may not pass through the root. Length is counted
// in EDGES, not nodes.
//   [5,4,5,1,1,null,5]  ->  2   (the three 5s: 5 - 5 - 5)
//   [1,4,5,4,4,null,5]  ->  2   (the three 4s)
//   [1]                 ->  0
//   []                  ->  0

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

function longestUnivaluePath(root: TreeNode | null): number {
  let max: number = 0;

  function dfs(node: TreeNode | null): number {
    if(node === null) {
      return 0;
    }

    if (node.left === null && node.right === null) {
      return 0;
    }
    
    const leftPath = dfs(node.left);
    const leftLength = node.left?.val === node.val ? leftPath + 1 : 0;

    const rightPath = dfs(node.right);
    const rightLength = node.right?.val === node.val ? rightPath + 1 : 0;

    max = Math.max(max, leftLength + rightLength);

    return Math.max(leftLength, rightLength); 
  }

  dfs(root);


  return max;
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
  { vals: [5, 4, 5, 1, 1, null, 5], expected: 2 },
  { vals: [1, 4, 5, 4, 4, null, 5], expected: 2 },
  { vals: [1], expected: 0 },
  { vals: [], expected: 0 },
  { vals: [1, null, 1, null, 1, null, 1], expected: 3 },
  { vals: [2, 2, 2, 2, null, 2], expected: 4 },
  { vals: [1, 2, 2, 2, 2], expected: 2 },
  { vals: [4, 4, 4, 4, 4, 4, 4], expected: 4 },
  { vals: [1, 2, 3], expected: 0 },
];

cases.forEach(({ vals, expected }) => {
  const actual = longestUnivaluePath(build(vals));
  const pass = actual === expected;
  console.log(`${pass ? '✓' : '✗'} longestUnivaluePath(${JSON.stringify(vals)}) = ${actual} (exp ${expected})`);
});
