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
  const map = new Map<string, string[]>();
  function makeKey(str: string): string {
    const keyArr: number[] = [0];
    let lastCharCode: number = str.charCodeAt(0);
    for(let i = 1;i < str.length;i++) {
      const curCharCode = str.charCodeAt(i);
      const distance = curCharCode - lastCharCode;
      keyArr.push(distance > 0 ? distance : distance + 26);
      lastCharCode = curCharCode;
    }

    return keyArr.join(':');
  }

  for(let str of strs) {
    const key = makeKey(str);
    const existing = map.get(key);
    if (existing === undefined) {
      map.set(key, [str]);
    } else {
      existing.push(str);
    }
  }
  
  return Array.from(map.values());
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
