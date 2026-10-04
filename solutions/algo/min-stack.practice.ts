class MinStack {
  main: number[];
  min: number[];

  constructor() {
    this.main = [];
    this.min = [];
  }

  push(val: number): void {
    this.main.push(val);
    const currentMin = this.getMin();
    const min = val < currentMin || typeof currentMin === 'undefined' ? val : currentMin;
    this.min.push(min);
  }

  pop(): void {
    this.min.pop();
    this.main.pop();
  }

  top(): number {
    return this.main[this.main.length - 1];
  }

  getMin(): number {
    return this.min[this.min.length - 1];
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
