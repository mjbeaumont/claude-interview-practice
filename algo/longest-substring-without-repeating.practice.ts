// Longest Substring Without Repeating Characters.
//
// Given a string s, return the length of the longest substring without
// repeating characters.
//   "abcabcbb" -> 3   ("abc")
//   "bbbbb"    -> 1   ("b")
//   "pwwkew"   -> 3   ("wke")
//   ""         -> 0

function lengthOfLongestSubstring(s: string): number {
   
}

// ---- test harness ----
const cases: [string, number][] = [
  ["abcabcbb", 3],
  ["bbbbb", 1],
  ["pwwkew", 3],
  ["", 0],
  ["a", 1],
  ["dvdf", 3],
  ["abba", 2],
];
for (const [input, exp] of cases) {
  const got = lengthOfLongestSubstring(input);
  const pass = got === exp;
  console.log(`${pass ? "✓" : "✗"} lengthOfLongestSubstring(${JSON.stringify(input)}) = ${got} (exp ${exp})`);
}
