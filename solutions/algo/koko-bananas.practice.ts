// Koko Eating Bananas (binary search on the answer space).
//
// Koko eats from piles[] over h hours. Each hour she picks one pile and eats up
// to k bananas from it; if the pile has fewer than k left she finishes it and
// waits out the rest of the hour. Return the minimum integer eating speed k
// such that she finishes all piles within h hours.
// hoursNeeded(piles, k) is a helper: the hours required at speed k.

// Hours Koko needs to eat all piles at speed k.
function hoursNeeded(piles: number[], k: number): number {
  let hours = 0;
  for (const pile of piles) {
    hours += Math.ceil(pile / k);
  }

  return hours;
}

// Min speed k such that all piles are eaten within h hours (leftmost-true search).
function minEatingSpeed(piles: number[], h: number): number {
  let lo = 1;
  let hi = Math.max(...piles);

  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const needed = hoursNeeded(piles, mid);
    if (needed <= h) {
      hi = mid;
    } else if (needed > h) {
      lo = mid + 1;
    }
  }

  return hi;
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
