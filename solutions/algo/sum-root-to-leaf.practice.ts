// Sum Root to Leaf Numbers (LC 129).
//
// Each root-to-leaf path spells a number, one digit per node, root digit first.
// Return the sum of every root-to-leaf number.
//   [1,2,3]            ->  12 + 13         = 25
//   [4,9,0,5,1]        ->  495 + 491 + 40  = 1026
//   []                 ->  0
//
// A leaf is a node with no children. All values are 0..9.

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

function sumNumbers(root: TreeNode | null): number {
  if(root === null) return 0;

  function dfs(node: TreeNode | null, num: number): number {
    if(node === null) {
      return 0;
    }

    const nextNum = num * 10 + node.val;

    if(node.left === null && node.right === null) {
      return nextNum;
    }

    return dfs(node.left, nextNum) + dfs(node.right, nextNum); 
  }

  return dfs(root, 0); 
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
  { vals: [1, 2, 3], expected: 25 },
  { vals: [4, 9, 0, 5, 1], expected: 1026 },
  { vals: [], expected: 0 },
  { vals: [7], expected: 7 },
  { vals: [0, 1], expected: 1 },
  { vals: [1, 2, 3, 4, 5, 6, 7], expected: 522 },
  { vals: [1, null, 2, null, 3, null, 4], expected: 1234 },
];

cases.forEach(({ vals, expected }) => {
  const actual = sumNumbers(build(vals));
  const pass = actual === expected;
  console.log(`${pass ? '✓' : '✗'} sumNumbers(${JSON.stringify(vals)}) = ${actual} (exp ${expected})`);
});
