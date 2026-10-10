# Drill rotation

Each entry has the trigger that points to it and the look-alike that points away.
Pick problems that are not in the repo's practice or solutions folders. Verify every
expected output before delivery. Skip list from the plan applies: no hard 2-D DP,
Dijkstra, bit manipulation, or heavy math.

1. **Window, shrink while valid.** Trigger: longest or shortest contiguous piece, a rule on the piece, and the rule survives shrinking or growing. Look-alike: prefix sums with a hash map (negatives break monotonicity), set with a skip rule (the run is not contiguous in the array).
2. **Hash set with a skip rule.** Trigger: one membership question asked repeatedly. Look-alike: window (contiguous in value space, not in the array).
3. **Prefix and suffix tables.** Trigger: repeated range queries that cannot use subtraction. Look-alike: prefix sum with a hash map.
4. **Prefix sum with a hash map.** Trigger: count or find subarrays with an exact target and values that can be negative. Look-alike: window.
5. **Two pointers on sorted input.** Trigger: pair or triple with a target, input sorted or sortable. Look-alike: hash map for pairs (works unsorted at O(n) space).
6. **Binary search on the answer.** Trigger: minimize or maximize a quantity, with a yes or no check that flips once. Look-alike: greedy, DP.
7. **Monotonic stack.** Trigger: for each element, the nearest earlier or later element that beats it. Look-alike: window.
8. **Heap for the extreme.** Trigger: repeated "give me the smallest or largest" while the data changes. Look-alike: sort once, bucket by frequency.
9. **BFS by layers.** Trigger: fewest steps in an unweighted structure, or level-by-level output. Look-alike: DFS for reachability.
10. **DFS that returns a value.** Trigger: a tree or graph answer built from the answers of children. Look-alike: BFS by layers.
11. **Sort then sweep intervals.** Trigger: overlap, merge, or room-count questions on ranges. Look-alike: heap of end times.
12. **Backtracking.** Trigger: generate all arrangements under a constraint. Look-alike: DP when only the count or best is needed.
13. **One-dimensional DP.** Trigger: a repeated choice that leaves a smaller copy of the same problem, with overlapping subproblems. Look-alike: greedy.
14. **Fast and slow pointers.** Trigger: cycle, middle, or nth-from-end in a linked structure. Look-alike: hash set of visited nodes (works at O(n) space).

Rotation rule: at least one problem in three is a look-alike. The candidate's first
instinct must fail, for a reason a trigger can explain.
