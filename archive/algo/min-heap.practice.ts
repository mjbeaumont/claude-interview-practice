// Min-Heap.
//
// Implement a min-heap of numbers with insert and extract-min in O(log n)
// and peek in O(1).
//
// Contract:
//   push(x)  — insert x
//   pop()    — remove and return the smallest element; undefined if empty
//   peek()   — return the smallest element without removing it; undefined if empty
//   size()   — number of elements currently in the heap
//
// Duplicates are allowed.
//   push 5, 3, 8, 1  then pop, pop  -> 1, 3
//   pop on an empty heap            -> undefined

class MinHeap {
  size(): number {

  }

  peek(): number | undefined {

  }

  push(x: number): void {

  }

  pop(): number | undefined {

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
