// Count Good Rectangles.
//
// For each rectangle, the largest square you can cut from it has side
// length min(width, height). Return how many rectangles can produce the
// largest such square across the whole list.
//   [[5,8],[3,9],[5,12],[16,5]] -> 3   (largest square side = 5, 3 rects tie)

function countGoodRectangles(rectangles: number[][]): number {

}

// ---- test harness ----
const countGoodRectanglesCases: [number[][], number][] = [
  [[[5,8],[3,9],[5,12],[16,5]], 3],
  [[[2,3],[3,7],[4,3],[3,7]], 3],
  [[[1,1]], 1],
];
for (const [rectangles, exp] of countGoodRectanglesCases) {
  const got = countGoodRectangles(rectangles);
  const pass = got === exp;
  console.log(`${pass ? "✓" : "✗"} countGoodRectangles(${JSON.stringify(rectangles)}) = ${got} (exp ${exp})`);
}
