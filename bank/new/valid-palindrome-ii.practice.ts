// Valid Palindrome II (LC 680).
//
// Given a string s, return true if s can be made to read the same forward and
// backward by deleting at most one character. A string that already reads the
// same both ways counts.
//   "aba"   -> true
//   "abca"  -> true   (delete 'c' or 'b')
//   "abc"   -> false
// Constraints: 1 <= s.length <= 100000, s holds lowercase English letters.

function validPalindromeII(s: string): boolean {
  return undefined as unknown as boolean;
}

// --- quick test harness ---
const cases: [string, boolean][] = [
  ["aba", true],
  ["abca", true],
  ["abc", false],
  ["a", true],
  ["ab", true],
  ["abba", true],
  ["deeee", true],
  ["cupuufxoohdfpgjdmysgvhmvffcnqxjjxqncffvmhvgsymdjgpfdhooxfuupuculmgmqfvnbgtapekouga", true],
  ["eedede", true],
  ["abcdeba", false],
  ["a".repeat(50000) + "b" + "a".repeat(50000), true],
];
for (const [input, exp] of cases) {
  const got = validPalindromeII(input);
  const shown = input.length > 40 ? `<${input.length} chars>` : JSON.stringify(input);
  console.log(`${got === exp ? "✓" : "✗"} validPalindromeII(${shown}) = ${got} (exp ${exp})`);
}
