// Daily Temperatures.
//
// Given an array temps[] of daily temperatures, return an array answer where
// answer[i] is the number of days you must wait after day i for a warmer
// temperature. If no warmer day exists, answer[i] = 0.
// temps = [73,74,75,71,69,72,76,73] -> [1,1,4,2,1,1,0,0].

function dailyTemperatures(temps: number[]): number[] {

}

// ---- test harness ----
const cases: [number[], number[]][] = [
  [[73, 74, 75, 71, 69, 72, 76, 73], [1, 1, 4, 2, 1, 1, 0, 0]],
  [[73, 74, 71, 72], [1, 0, 1, 0]],
  [[30, 40, 50, 60], [1, 1, 1, 0]],
  [[60, 50, 40, 30], [0, 0, 0, 0]],
  [[55], [0]],
  [[73, 71, 70, 75], [3, 2, 1, 0]],
];
for (const [input, exp] of cases) {
  const got = dailyTemperatures(input);
  const pass = JSON.stringify(got) === JSON.stringify(exp);
  console.log(`${pass ? "✓" : "✗"} ${JSON.stringify(input)} → ${JSON.stringify(got)} (exp ${JSON.stringify(exp)})`);
}
