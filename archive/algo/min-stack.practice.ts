// Min Stack.
//
// Design a stack that supports push, pop, top, and retrieving the minimum
// element — all in O(1) time.
//   push(val): push val onto the stack.
//   pop():     remove the element on top of the stack.
//   top():     return the element on top of the stack.
//   getMin():  return the minimum element currently in the stack.

class MinStack {

  constructor() {

  }

  push(val: number): void {

  }

  pop(): void {

  }

  top(): number {

  }

  getMin(): number {

  }
}

// ---- test harness ----
const s = new MinStack();
s.push(-2);
s.push(0);
s.push(-3);
console.log(`${s.getMin() === -3 ? "✓" : "✗"} getMin = ${s.getMin()} (exp -3)`);
s.pop();
console.log(`${s.top() === 0 ? "✓" : "✗"} top = ${s.top()} (exp 0)`);
console.log(`${s.getMin() === -2 ? "✓" : "✗"} getMin = ${s.getMin()} (exp -2)`);
s.push(-5);
console.log(`${s.getMin() === -5 ? "✓" : "✗"} getMin = ${s.getMin()} (exp -5)`);
s.pop();
console.log(`${s.getMin() === -2 ? "✓" : "✗"} getMin = ${s.getMin()} (exp -2)`);
