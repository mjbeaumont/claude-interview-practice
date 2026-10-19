// Lowest Common Ancestor of a Binary Tree III (LC 1650).
//
// Every node holds a reference to its parent. The root's parent is null.
// You are given two different nodes p and q from the same tree, but NOT the root.
// Return their lowest common ancestor: the deepest node that has both p and q as
// descendants. A node counts as a descendant of itself.
//   tree [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1  ->  3
//   tree [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4  ->  5
//   tree [1,2],                         p = 1, q = 2  ->  1
// Constraints: 2 <= nodes <= 100000, all values are unique, p and q both exist.

class Node {
  val: number;
  left: Node | null;
  right: Node | null;
  parent: Node | null;
  constructor(val: number) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

function lowestCommonAncestor(p: Node, q: Node): Node | null {

}

// --- quick test harness ---
function build(vals: (number | null)[]): Map<number, Node> {
  const byVal = new Map<number, Node>();
  const root = new Node(vals[0]!);
  byVal.set(root.val, root);
  const queue: Node[] = [root];
  let i = 1;
  while (queue.length && i < vals.length) {
    const node = queue.shift()!;
    const l = vals[i++];
    if (l !== null && l !== undefined) {
      node.left = new Node(l);
      node.left.parent = node;
      byVal.set(l, node.left);
      queue.push(node.left);
    }
    const r = vals[i++];
    if (r !== null && r !== undefined) {
      node.right = new Node(r);
      node.right.parent = node;
      byVal.set(r, node.right);
      queue.push(node.right);
    }
  }
  return byVal;
}

const cases: { vals: (number | null)[]; p: number; q: number; expected: number }[] = [
  { vals: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 5, q: 1, expected: 3 },
  { vals: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 5, q: 4, expected: 5 },
  { vals: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 7, q: 4, expected: 2 },
  { vals: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 6, q: 8, expected: 3 },
  { vals: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 4, q: 5, expected: 5 },
  { vals: [1, 2], p: 1, q: 2, expected: 1 },
  { vals: [1, 2], p: 2, q: 1, expected: 1 },
  { vals: [1, 2, null, 3, null, 4], p: 4, q: 2, expected: 2 },
];

cases.forEach(({ vals, p, q, expected }) => {
  const byVal = build(vals);
  const got = lowestCommonAncestor(byVal.get(p)!, byVal.get(q)!);
  const pass = got?.val === expected;
  console.log(`${pass ? '✓' : '✗'} tree ${JSON.stringify(vals)} p=${p} q=${q} = ${got?.val} (exp ${expected})`);
});

// Long chain: node k has parent k-1. 100000 nodes deep.
{
  const nodes: Node[] = [];
  for (let k = 0; k < 100000; k++) {
    const n = new Node(k);
    if (k > 0) {
      n.parent = nodes[k - 1];
      nodes[k - 1].left = n;
    }
    nodes.push(n);
  }
  const got = lowestCommonAncestor(nodes[99999], nodes[50000]);
  console.log(`${got?.val === 50000 ? '✓' : '✗'} chain of 100000, deepest vs middle = ${got?.val} (exp 50000)`);
}
