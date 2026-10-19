// Longest Repeating Character Replacement (LC 424).
//
// Given an uppercase string s and an integer k, you may change at most k
// characters to any other uppercase letter. Return the length of the longest
// substring that can be made all one letter.
//   "ABAB", 2     ->  4
//   "AABABBA", 1  ->  4
//   "A", 0        ->  1
// Constraints: 1 <= s.length <= 100000, 0 <= k <= s.length.

class FrequencyMap {
  data: Map<string, number>;

  constructor() {
    this.data = new Map();
  }

  increment(key: string): void {
    const existing = this.data.get(key);
    const next = existing === undefined ? 1 : existing + 1;
    this.data.set(key, next);
  }

  decrement(key: string): void {
    const existing = this.data.get(key)!;
    this.data.set(key, existing - 1);
  }

  max(): number {
    let max: number = 0;
    for(let [key, val] of this.data.entries()) {
      if (val > max) {
        max = val;
      }
    }

    return max;
  }
}

function getLength(right: number, left: number) {
  return right - left + 1;
}

function characterReplacement(s: string, k: number): number {
  const fm = new FrequencyMap();
  let left: number = 0;
  fm.increment(s[left]);
  let max: number = 1;

  for(let right = 1;right < s.length;right++) {
    fm.increment(s[right]);
    while(getLength(right, left) > fm.max() + k) {
      fm.decrement(s[left]);
      left++;
    }

    if (getLength(right, left) > max) {
      max = getLength(right, left);
    }
  } 

  return max;
}

// --- quick test harness ---
const cases: { s: string; k: number; expected: number }[] = [
  { s: 'ABAB', k: 2, expected: 4 },
  { s: 'AABABBA', k: 1, expected: 4 },
  { s: 'A', k: 0, expected: 1 },
  { s: 'AAAA', k: 2, expected: 4 },
  { s: 'ABC', k: 0, expected: 1 },
  { s: 'ABBB', k: 2, expected: 4 },
  { s: 'ABCDE', k: 1, expected: 2 },
  { s: 'AABBBCCC', k: 2, expected: 5 },
  { s: 'ABCDE', k: 5, expected: 5 },
  { s: 'BAAAB', k: 2, expected: 5 },
];

cases.forEach(({ s, k, expected }) => {
  const actual = characterReplacement(s, k);
  const pass = actual === expected;
  console.log(`${pass ? '✓' : '✗'} characterReplacement(${JSON.stringify(s)}, ${k}) = ${actual} (exp ${expected})`);
});
