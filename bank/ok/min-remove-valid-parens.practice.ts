// Minimum Remove to Make Valid Parentheses (LC 1249).
//
// Given a string s of lowercase letters, '(' and ')', remove the fewest
// parentheses so that the result is valid, and return any valid result.
// A string is valid if it has no parentheses, or every '(' is closed by a later
// ')' and every ')' closes an earlier '(', with correct nesting.
//   "lee(t(c)o)de)"  ->  "lee(t(c)o)de"   (other valid answers of the same length are fine)
//   "a)b(c)d"        ->  "ab(c)d"
//   "))(("           ->  ""
// Constraints: 1 <= s.length <= 100000.

function minRemoveToMakeValid(s: string): string {

}

// ---- test harness ----
// More than one answer can be correct, so the harness checks three properties of
// the result: it is valid, it is the input with some parentheses removed, and it
// has the expected length.
function isBalanced(t: string): boolean {
  let open = 0;
  for (const ch of t) {
    if (ch === "(") open++;
    if (ch === ")") open--;
    if (open < 0) return false;
  }
  return open === 0;
}

function isSubsequence(t: string, s: string): boolean {
  let i = 0;
  for (const ch of s) {
    if (i < t.length && t[i] === ch) i++;
  }
  return i === t.length;
}

const minRemoveCases: [string, number][] = [
  ["lee(t(c)o)de)", 12],
  ["a)b(c)d", 6],
  ["))((", 0],
  ["abc", 3],
  ["(", 0],
  ["(()", 2],
  [")(", 0],
  ["a(", 1],
  ["(a(b(c)d)", 8],
];
for (const [input, expLen] of minRemoveCases) {
  const got = minRemoveToMakeValid(input);
  const pass =
    typeof got === "string" &&
    got.length === expLen &&
    isBalanced(got) &&
    isSubsequence(got, input);
  console.log(`${pass ? "✓" : "✗"} minRemoveToMakeValid(${JSON.stringify(input)}) = ${JSON.stringify(got)} (exp length ${expLen})`);
}
