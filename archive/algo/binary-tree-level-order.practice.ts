// Binary Tree Level Order Traversal.
//
// Given the root of a binary tree, return the node values grouped level by
// level, top to bottom (each level read left-to-right).
//   [3,9,20,null,null,15,7]  ->  [[3],[9,20],[15,7]]
//   []                       ->  []
//   [1]                      ->  [[1]]

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

function levelOrder(root: TreeNode | null): number[][] {

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

const levelOrderCases: [(number | null)[], number[][]][] = [
  [[3, 9, 20, null, null, 15, 7], [[3], [9, 20], [15, 7]]],
  [[], []],
  [[1], [[1]]],
  [[1, 2, 3, 4, 5], [[1], [2, 3], [4, 5]]],
  [[1, null, 2, null, 3], [[1], [2], [3]]],
];
for (const [arr, exp] of levelOrderCases) {
  const got = levelOrder(buildTree(arr));
  const pass = JSON.stringify(got) === JSON.stringify(exp);
  console.log(`${pass ? "✓" : "✗"} levelOrder(${JSON.stringify(arr)}) = ${JSON.stringify(got)} (exp ${JSON.stringify(exp)})`);
}
