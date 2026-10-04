// Lowest Common Ancestor of a Binary Tree.
//
// Given the root of a binary tree and two nodes p and q that both exist in
// the tree, return their lowest common ancestor — the deepest node that has
// both p and q as descendants (a node is allowed to be a descendant of
// itself).
//   tree [3,5,1,6,2,0,8,null,null,7,4], p=5, q=1  -> 3
//   tree [3,5,1,6,2,0,8,null,null,7,4], p=5, q=4  -> 5  (5 is an ancestor of 4)
//   tree [1,2],                        p=1, q=2  -> 1

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

function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {

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

// Assumes distinct values; finds the node holding `val`.
function findNode(root: TreeNode | null, val: number): TreeNode | null {
  if (!root) return null;
  if (root.val === val) return root;
  return findNode(root.left, val) ?? findNode(root.right, val);
}

const lcaCases: [(number | null)[], number, number, number][] = [
  [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1, 3],
  [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4, 5],
  [[1, 2], 1, 2, 1],
  [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 6, 4, 5],
];
for (const [arr, pVal, qVal, expVal] of lcaCases) {
  const root = buildTree(arr);
  const p = findNode(root, pVal)!;
  const q = findNode(root, qVal)!;
  const got = lowestCommonAncestor(root, p, q);
  const pass = got?.val === expVal;
  console.log(`${pass ? "✓" : "✗"} LCA(p=${pVal}, q=${qVal}) = ${got?.val} (exp ${expVal})`);
}
