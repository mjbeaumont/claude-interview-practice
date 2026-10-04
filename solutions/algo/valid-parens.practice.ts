function isValid(s: string): boolean {
  const stack: string[] = [];

  const pairs = new Map<string, string>([
    ['(', ')'],
    ['[', ']'],
    ['{', '}'], 
  ]);

  const chars = s.split('');
  for(const char of chars) {
    // is opener
    if (pairs.has(char)) {
      stack.push(char);
    }
    // is closer
    else {
      const opener = stack.pop();
      if (opener) {
        const closer = pairs.get(opener);
        if (closer !== char) {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  return stack.length === 0;

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
