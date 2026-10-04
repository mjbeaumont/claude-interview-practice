// Clone Graph — practice (hashmap-while-traversing)
//
// Given a reference to a node in a CONNECTED, UNDIRECTED graph, return a DEEP
// COPY of the whole graph. Each node holds a `val` and a list of `neighbors`.
// The copy must share NO node objects with the original, but have identical
// structure (same vals, same connections — including the cycles).
//
// Decode:
//   Q1 node  = a graph node
//   Q2 edge  = if a node is listed in neighbors
//   Q3 wrap  = BFS, but store clones in a hashmap so you don't create extras

class GraphNode {
  val: number;
  neighbors: GraphNode[];
  constructor(val: number, neighbors: GraphNode[] = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}


// Returns a deep copy of the graph reachable from `node`, or null if `node` is null.
function cloneGraph(node: GraphNode | null): GraphNode | null {
  const cache = new Map<number, GraphNode>;

  if (node === null) {
    return null;
  }

  function dfs(node: GraphNode): GraphNode {
    let clone: GraphNode;

    if (cache.has(node.val)) {
      clone = cache.get(node.val)!;
      return clone;
    } else {
      clone = new GraphNode(node.val);
      cache.set(clone.val, clone);
    }

    for (const neighbor of node.neighbors) {
      const neighborClone = dfs(neighbor);
      if (neighborClone) {
        clone?.neighbors.push(neighborClone);
      }
    }
    return clone;
  }

  return dfs(node);
}

// --- quick test harness ---

// Build a graph from a LeetCode-style adjacency list. adj[i] lists the vals of
// node (i+1)'s neighbors; vals are 1-indexed. [] => empty graph (null).
function buildGraph(adj: number[][]): GraphNode | null {
  if (adj.length === 0) return null;
  const nodes = adj.map((_, i) => new GraphNode(i + 1));
  adj.forEach((neighborVals, i) => {
    nodes[i].neighbors = neighborVals.map(v => nodes[v - 1]);
  });
  return nodes[0];
}

// Collect every distinct node object reachable from `start`.
function collect(start: GraphNode | null): Set<GraphNode> {
  const seen = new Set<GraphNode>();
  const stack = start ? [start] : [];
  while (stack.length) {
    const n = stack.pop()!;
    if (seen.has(n)) continue;
    seen.add(n);
    for (const nb of n.neighbors) stack.push(nb);
  }
  return seen;
}

// Canonical structure string: "val -> [sorted neighbor vals]" per node, sorted by val.
function structure(start: GraphNode | null): string {
  return [...collect(start)]
    .sort((a, b) => a.val - b.val)
    .map(n => `${n.val}->[${n.neighbors.map(x => x.val).sort((a, b) => a - b).join(',')}]`)
    .join(' | ');
}

function verify(label: string, original: GraphNode | null): void {
  const clone = cloneGraph(original);

  const sameStructure = structure(original) === structure(clone);

  // No node object may be shared between the two graphs.
  const originals = collect(original);
  const clones = collect(clone);
  const shared = [...clones].some(c => originals.has(c));

  const ok = sameStructure && !shared && (original === null) === (clone === null);
  console.log(`${ok ? '✓' : '✗'} ${label}`);
  if (!ok) {
    console.log(`  structure match: ${sameStructure} (shared nodes: ${shared})`);
    console.log(`  original: ${structure(original)}`);
    console.log(`  clone:    ${structure(clone)}`);
  }
}

verify('square (4 nodes, cycles)', buildGraph([[2, 4], [1, 3], [2, 4], [1, 3]]));
verify('single node, no neighbors', buildGraph([[]]));
verify('two nodes', buildGraph([[2], [1]]));
verify('empty graph', buildGraph([]));
