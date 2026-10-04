// Valid Parentheses.
//
// Given a string s containing only the characters '(', ')', '{', '}', '[', ']',
// return true if every bracket is closed by a matching bracket of the same type,
// in the correct order, and every bracket is matched. "()[]{}" -> true,
// "(]" -> false, "([)]" -> false, "{[]}" -> true.

function isValid(s: string): boolean {

}

// ---- test harness ----
const cases: [string, boolean][] = [
  ["()", true],
  ["()[]{}", true],
  ["(]", false],
  ["([)]", false],
  ["{[]}", true],
  ["(", false],
  [")", false],
  ["(((", false],
  ["", true],
];
for (const [input, exp] of cases) {
  const got = isValid(input);
  console.log(`${got === exp ? "✓" : "✗"} isValid(${JSON.stringify(input)}) = ${got} (exp ${exp})`);
}
