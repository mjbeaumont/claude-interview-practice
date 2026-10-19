// Valid Palindrome.
//
// Given a string s, return true if it is a palindrome after considering only
// alphanumeric characters and ignoring case. An empty string (after removing
// non-alphanumeric characters) counts as a palindrome.
//   "A man, a plan, a canal: Panama" -> true
//   "race a car"                    -> false
//   " "                             -> true

function isPalindrome(s: string): boolean {

}

// ---- test harness ----
const cases: [string, boolean][] = [
  ["A man, a plan, a canal: Panama", true],
  ["race a car", false],
  [" ", true],
  ["", true],
  ["a", true],
  ["ab", false],
  ["0P", false],
  [".,", true],
];
for (const [input, exp] of cases) {
  const got = isPalindrome(input);
  const pass = got === exp;
  console.log(`${pass ? "✓" : "✗"} isPalindrome(${JSON.stringify(input)}) = ${got} (exp ${exp})`);
}
