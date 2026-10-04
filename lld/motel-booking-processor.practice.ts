// In-memory motel booking processor.
//
// Process a newline-separated input string of bookings, one per line, and
// produce a newline-separated output string, one line of result per line of
// input. The motel has 5 rooms, numbered 1-5, in memory only.
//
// A valid booking line is two ISO dates (YYYY-MM-DD) separated by a space:
// check-in then check-out, e.g. "2019-05-31 2019-06-05". Rooms may check in
// on the same day another reservation checks out (that's not a conflict).
//
// For each line, in order:
//   - if it isn't two valid ISO dates separated by a space -> "error: invalid input format"
//   - if the check-out isn't at least 1 day after check-in -> "error: invalid date range"
//   - if no room is free for that date range               -> "error: no rooms available"
//   - otherwise, book the lowest-numbered free room and output its number
//
// Write processBookings(input: string): string.

const SAMPLE_INPUT = `2019-05-31 2019-06-05
2019-05-31 2019-06-05
2019-05-31 2019-06-05
209-03-1
2019-05-31
May 1st through 3rd
2019-05-31 2019-05-31
2019-05-31 2019-05-30
2019-13-81 2019-14-61
2019-06-20 2019-06-25
2019-05-31 2019-06-05
2019-06-04 2019-06-09
2019-05-31 2019-06-05
2019-05-25 2019-05-31
2019-06-05 2019-06-08`;

const EXPECTED_OUTPUT = `1
2
3
error: invalid input format
error: invalid input format
error: invalid input format
error: invalid date range
error: invalid date range
error: invalid input format
1
4
5
error: no rooms available
1
1`;

function processBookings(input: string): string {

}

// ---- test harness ----
const inputLines = SAMPLE_INPUT.split('\n');
const expectedLines = EXPECTED_OUTPUT.split('\n');
const actualLines = (processBookings(SAMPLE_INPUT) ?? '').split('\n');

for (let i = 0; i < expectedLines.length; i++) {
  const pass = actualLines[i] === expectedLines[i];
  console.log(`${pass ? "✓" : "✗"} [${inputLines[i]}] -> ${actualLines[i]} (exp ${expectedLines[i]})`);
}
