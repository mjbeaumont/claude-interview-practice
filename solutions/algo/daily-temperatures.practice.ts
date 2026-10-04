function dailyTemperatures(temps: number[]): number[] {
  const stack: number [] = [];
  const answers: number[] = new Array(temps.length).fill(0);

  for (const [day, temp] of temps.entries()) {
    while (stack.length && temp > temps[stack[stack.length - 1]]) {
        const waiting = stack[stack.length - 1];
        answers[waiting] = day - waiting;
        stack.pop();
    }

    stack.push(day);
  }

  return answers;

}

// ---- test harness ----
const cases: [number[], number[]][] = [
  [[73, 74, 75, 71, 69, 72, 76, 73], [1, 1, 4, 2, 1, 1, 0, 0]],
  [[73, 74, 71, 72], [1, 0, 1, 0]],
  [[30, 40, 50, 60], [1, 1, 1, 0]],
  [[60, 50, 40, 30], [0, 0, 0, 0]],
  [[55], [0]],
];
for (const [input, exp] of cases) {
  const got = dailyTemperatures(input);
  const pass = JSON.stringify(got) === JSON.stringify(exp);
  console.log(`${pass ? "✓" : "✗"} ${JSON.stringify(input)} → ${JSON.stringify(got)} (exp ${JSON.stringify(exp)})`);
}
