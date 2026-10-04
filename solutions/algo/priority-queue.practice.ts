// Priority Queue (binary heap over a flat array).
//
// Ordered by the comparator passed to the constructor: cmp(a, b) < 0 means a
// comes out before b. Peek in O(1), insert / extract in O(log n). It's stored
// as a plain array where the tree structure is implied by index arithmetic.
//
// Contract:
//   push(x)  — insert x, keeping the heap invariant (no child comes before its parent)
//   pop()    — remove and return the front element; undefined if empty
//   peek()   — return the front element without removing it
//   size()   — number of elements currently in the queue

type Cmp<T> = (a: T, b: T) => number;

export const minComparator: Cmp<number> = (a, b) => a - b;
export const maxComparator: Cmp<number> = (a, b) => b - a;


export class PriorityQueue<T> {
  private data: T[] = [];
  cmp: Cmp<T>;

  constructor(cmp: Cmp<T>) {
    this.cmp = cmp;
  }

  size(): number {
    return this.data.length; 
  }

  peek(): T | undefined {
    return this.data[0]; 
  }

  push(x: T): void {
    this.data.push(x);
    let child = this.data.length -1;
    let parent = this._getParent(child);
    while(parent >= 0 && this.cmp(this.data[child], this.data[parent]) < 0) {
      this._swap(parent, child);
      child = parent;
      parent = this._getParent(child);
    }
  }

  pop(): T | undefined {

    const last = this.data.pop()!;

    if(this.size() === 0) {
      return last;
    }

    const min = this.data[0];
    this.data[0] = last; 
    
    let best = 0;
    while(true) {
      const cur = best;
      const { left, right } = this._getChildren(best);
      if(left < this.size()  && this.cmp(this.data[left], this.data[best]) < 0) {
        best = left;
      }

      if(right < this.size() && this.cmp(this.data[right], this.data[best]) < 0) {
        best = right;
      }

      if (cur !== best) {
        this._swap(cur, best);
      } else {
        break;
      }
    }

    return min;
  }

  _getParent(index: number): number {
    // 3&4 = 1, 5&6 = 2
    return Math.ceil(index / 2) - 1; 
  }

  _getChildren(index: number): { left: number, right: number } {
    return {
      left: (index * 2) + 1,
      right: (index * 2) + 2,
    }
  }

  _swap(idx1: number, idx2: number): void {
    const tmp = this.data[idx1];
    this.data[idx1] = this.data[idx2];
    this.data[idx2] = tmp;
  }



}
// ---- test harness ----
function runHeapTests(): void {
  const h = new PriorityQueue<number>(minComparator);
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
  const h2 = new PriorityQueue<number>(minComparator);
  [4, 4, 1, 1, 4, 1].forEach((x) => h2.push(x));
  check(h2.pop() === 1 && h2.pop() === 1 && h2.pop() === 1, "handles duplicates");
  h2.push(0);
  check(h2.peek() === 0, "peek after interleaved push");

  console.log(ok ? "\nALL PASS" : "\nSOME FAILED");
}
runHeapTests();
