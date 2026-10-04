// Count Good Rectangles.
//
// For each rectangle, the largest square you can cut from it has side
// length min(width, height). Return how many rectangles can produce the
// largest such square across the whole list.
//   [[5,8],[3,9],[5,12],[16,5]] -> 3   (largest square side = 5, 3 rects tie)

function countGoodRectangles(rectangles: number[][]): number {
   const squares = new Map<number, number>();
   for (let i = 0;i < rectangles.length;i++) {
        const squareSize = Math.min(rectangles[i][0], rectangles[i][1]);
        const existing = squares.get(squareSize);
        const count = existing === undefined ? 1 : existing + 1;
        squares.set(squareSize, count);
   }

   const max = Math.max(...squares.keys());
   return squares.get(max) ?? 0;
};

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
