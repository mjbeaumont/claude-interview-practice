// Count Nodes Equal to Average of Subtree (LC 2265).
//
// Given the root of a binary tree, return the number of nodes whose value equals
// the average of all values in its own subtree (the node itself included),
// with the average rounded down to the nearest integer.
//   [4,8,5,0,1,null,6]  ->  5
//   [1]                 ->  1
//   []                  ->  0
// Constraints: 0 <= node count <= 1000, 0 <= node value <= 1000.

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

function averageOfSubtree(root: TreeNode | null): number {

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

const averageCases: [(number | null)[], number][] = [
  [[4, 8, 5, 0, 1, null, 6], 5],
  [[1], 1],
  [[], 0],
  [[4, 8, 0], 3],
  [[0, 0, 9, null, null, 9, 9], 4],
  [[1, null, 2, null, 3], 2],
  [[1, 2], 2],
  [[0, 0, 0], 3],
];
for (const [arr, exp] of averageCases) {
  const got = averageOfSubtree(buildTree(arr));
  const pass = got === exp;
  console.log(`${pass ? "✓" : "✗"} averageOfSubtree(${JSON.stringify(arr)}) = ${got} (exp ${exp})`);
}
