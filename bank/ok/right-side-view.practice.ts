// Binary Tree Right Side View (LC 199).
//
// Given the root of a binary tree, imagine standing on its right side. Return
// the values of the nodes you can see, ordered top to bottom.
//   [1,2,3,null,5,null,4]  ->  [1,3,4]
//   [1,null,3]             ->  [1,3]
//   []                     ->  []

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

function rightSideView(root: TreeNode | null): number[] {

}

// ---- test harness ----
// Builds a tree from a LeetCode-style level-order array (null = no child).
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null) {
        node.left = new TreeNode(leftVal);
        queue.push(node.left);
      }
    }
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null) {
        node.right = new TreeNode(rightVal);
        queue.push(node.right);
      }
    }
  }
  return root;
}

const rightSideViewCases: [(number | null)[], number[]][] = [
  [[1, 2, 3, null, 5, null, 4], [1, 3, 4]],
  [[1, null, 3], [1, 3]],
  [[], []],
  [[1], [1]],
  [[1, 2], [1, 2]],
  [[1, 2, 3, 4], [1, 3, 4]],
  [[1, 2, 3, 4, null, null, null, 5], [1, 3, 4, 5]],
];
for (const [arr, exp] of rightSideViewCases) {
  const got = rightSideView(buildTree(arr));
  const pass = JSON.stringify(got) === JSON.stringify(exp);
  console.log(`${pass ? "✓" : "✗"} rightSideView(${JSON.stringify(arr)}) = ${JSON.stringify(got)} (exp ${JSON.stringify(exp)})`);
}
