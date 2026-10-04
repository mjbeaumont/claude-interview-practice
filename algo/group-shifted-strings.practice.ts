// Group Shifted Strings.
//
// Two strings belong to the same group if one can be turned into the other by
// shifting every letter by the same amount, wrapping 'z' -> 'a'.
//   "abc" shifted by +1 -> "bcd"
//   "az"  shifted by +1 -> "ba"   (each letter wraps independently)
// Given a list of strings, group all strings that are shifts of each other.
// Groups and the strings within a group may be returned in any order.
//   ["abc","bcd","acef","xyz","az","ba","a","z"]
//     -> [["abc","bcd","xyz"],["acef"],["az","ba"],["a","z"]]

function groupStrings(strs: string[]): string[][] {

}

// ---- test harness ----
// Order-independent comparison: sort each group, then sort the list of groups.
function normalize(groups: string[][]): string[][] {
  return groups
    .map((g) => [...g].sort())
    .sort((a, b) => a.join(",").localeCompare(b.join(",")));
}

const groupStringsCases: [string[], string[][]][] = [
  [
    ["abc", "bcd", "acef", "xyz", "az", "ba", "a", "z"],
    [["abc", "bcd", "xyz"], ["acef"], ["az", "ba"], ["a","z"]],
  ],
  [[""], [[""]]],
  [["a"], [["a"]]],
  [["ab", "cd", "yz"], [["ab", "cd", "yz"]]],
  [["yz", "za"], [["yz", "za"]]],
  [["aa", "nn"], [["aa", "nn"]]],
  [["aab", "nna"], [["aab"], ["nna"]]],
];
for (const [strs, exp] of groupStringsCases) {
  const got = groupStrings(strs);
  const pass = JSON.stringify(got && normalize(got)) === JSON.stringify(normalize(exp));
  console.log(`${pass ? "✓" : "✗"} groupStrings(${JSON.stringify(strs)}) = ${JSON.stringify(got)} (exp ${JSON.stringify(exp)})`);
}
