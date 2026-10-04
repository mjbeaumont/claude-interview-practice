// Validate Binary Search Tree.
//
// Given the root of a binary tree, return true if it is a valid BST: every
// node's value must be strictly greater than ALL values in its left subtree
// and strictly less than ALL values in its right subtree — not just its
// immediate children.
//   [2,1,3]                -> true
//   [5,1,4,null,null,3,6]  -> false  (4 is in 5's right subtree but < 5)
//   [10,5,15,null,null,6,20] -> false (6 is in 15's left subtree but < 10)

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

function isValidBST(root: TreeNode | null): boolean {

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

const validateBstCases: [(number | null)[], boolean][] = [
  [[2, 1, 3], true],
  [[5, 1, 4, null, null, 3, 6], false],
  [[10, 5, 15, null, null, 6, 20], false],
  [[], true],
  [[1], true],
  [[1, 1], false],
  [[5, 4, 6, null, null, 3, 7], false],
];
for (const [arr, exp] of validateBstCases) {
  const got = isValidBST(buildTree(arr));
  const pass = got === exp;
  console.log(`${pass ? "✓" : "✗"} isValidBST(${JSON.stringify(arr)}) = ${got} (exp ${exp})`);
}
