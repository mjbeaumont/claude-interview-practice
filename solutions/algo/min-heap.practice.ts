// Min-Heap (binary heap over a flat array).
//
// A min-heap keeps the smallest element reachable in O(1) and supports
// insert / extract-min in O(log n). It's stored as a plain array where the
// tree structure is implied by index arithmetic — no node objects, no pointers.
//
// Contract:
//   push(x)  — insert x, keeping the heap invariant (every parent <= its children)
//   pop()    — remove and return the smallest element; undefined if empty
//   peek()   — return the smallest element without removing it
//   size()   — number of elements currently in the heap
//
// The whole primitive rests on two questions you should answer before writing:
//   1. Given index i, what are the indices of its parent / left child / right child?
//   2. After push you break the invariant at the bottom; after pop you break it at
//      the top. Which direction does each one repair — up toward the root, or down
//      toward the leaves?

class MinHeap {
  private data: number[] = [];

  size(): number {
    return this.data.length;
  }

  peek(): number | undefined {
    return this.data[0];
  }

  push(x: number): void {
    this.data.push(x);
    if (this.size() === 1) {
      return
    }

    let cur = this.data.length - 1;
    while (cur > 0) {
      let parent = Math.floor((cur -1) / 2);
      if (this.data[parent] < this.data[cur]) {
        break;
      }
      this._swap(parent, cur);
      cur = parent;
    }
  }

  pop(): number | undefined {
    if (this.size() === 0) {
      return;
    }

    if (this.size() === 1) {
      return this.data.pop();
    }

    const val = this.peek();
    const last = this.data.pop()!;
    this.data[0] = last;
    let cur: number = 0;
    while(true) {
      let smallest = cur;
      let left = (cur * 2) + 1;
      let right = (cur * 2) + 2;
      if (left < this.size() && this.data[left] < this.data[smallest]) {
        smallest = left;
      } 
      
      if (right < this.size() && this.data[right] < this.data[smallest]) {
        smallest = right;
      } 

      if (smallest === cur) {
        break;
      }

      this._swap(cur, smallest);
      cur = smallest;
    }
    
    return val;
  }

  private _swap(idx1: number, idx2: number) {
     const tmp = this.data[idx1];
     this.data[idx1] = this.data[idx2];
     this.data[idx2] = tmp;
  } 
}

// ---- test harness ----
function runHeapTests(): void {
  const h = new MinHeap();
  let ok = true;
  const check = (cond: boolean, label: string) => {
    if (!cond) ok = false;
    console.log(`${cond ? "✓" : "✗"} ${label}`);
  };

  check(h.size() === 0, "empty size is 0");
  check(h.peek() === undefined, "empty peek is undefined");
  check(h.pop() === undefined, "empty pop is undefined");

  const input = [5, 3, 8, 1, 9, 2, 7, 4, 6, 0];
  for (const x of input) h.push(x);
  check(h.size() === input.length, `size is ${input.length} after pushes`);
  check(h.peek() === 0, "peek is min (0)");

  // Popping should yield ascending order — this is the real invariant test.
  const out: number[] = [];
  while (h.size() > 0) out.push(h.pop()!);
  const sorted = [...input].sort((a, b) => a - b);
  check(JSON.stringify(out) === JSON.stringify(sorted), `pops ascending: ${JSON.stringify(out)}`);

  // Duplicates + interleaved push/pop.
  const h2 = new MinHeap();
  [4, 4, 1, 1, 4, 1].forEach((x) => h2.push(x));
  check(h2.pop() === 1 && h2.pop() === 1 && h2.pop() === 1, "handles duplicates");
  h2.push(0);
  check(h2.peek() === 0, "peek after interleaved push");

  console.log(ok ? "\nALL PASS" : "\nSOME FAILED");
}
runHeapTests();
