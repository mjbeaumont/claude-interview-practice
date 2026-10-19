// Koko Eating Bananas.
//
// Koko eats from piles[] over h hours. Each hour she picks one pile and eats up
// to k bananas from it; if the pile has fewer than k left she finishes it and
// waits out the rest of the hour. Return the minimum integer eating speed k
// such that she finishes all piles within h hours.

function minEatingSpeed(piles: number[], h: number): number {

}

// ---- test harness ----
const kokoCases: [number[], number, number][] = [
  [[3, 6, 7, 11], 8, 4],
  [[30, 11, 23, 4, 20], 5, 30],
  [[30, 11, 23, 4, 20], 6, 23],
  [[1], 1, 1],
];
for (const [piles, h, exp] of kokoCases) {
  const got = minEatingSpeed(piles, h);
  console.log(`${got === exp ? "✓" : "✗"} minEatingSpeed(${JSON.stringify(piles)}, ${h}) = ${got} (exp ${exp})`);
}
