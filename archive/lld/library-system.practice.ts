// Library lending system — LLD practice
//
// A library has titles, each with one or more physical copies, and members who
// borrow them. Days are integers. Loans last 21 days; holds last 3 days.
//
//   new Library(titles): titles is a list of { id, copyIds }.
//   checkout(titleId, memberId, now): give the member a copy and return
//     { copyId, dueDate } with dueDate = now + 21. A copy reserved for this
//     member is handed over first; otherwise any free copy. Return null if the
//     member can't have one (every copy is on loan or reserved for someone else).
//   placeHold(titleId, memberId): add the member to the title's waiting list
//     (first come, first served).
//   returnCopy(titleId, copyId, now): the copy comes back. If anyone is waiting,
//     it's reserved for the first in line until now + 3; otherwise it's free.
//   runSweep(now): any reservation not picked up by its expiry day (now is past
//     the expiry) goes to the next member waiting, reserved until now + 3, or
//     becomes free if no one is waiting.
//
// An unknown titleId throws.

class Library {
  constructor(titles: { id: string; copyIds: string[] }[]) {

  }

  checkout(titleId: string, memberId: string, now: number): { copyId: string; dueDate: number } | null {

  }

  placeHold(titleId: string, memberId: string): void {

  }

  returnCopy(titleId: string, copyId: string, now: number): void {

  }

  runSweep(now: number): void {

  }
}

// --- quick test harness ---
function check(label: string, got: unknown, exp: unknown): void {
  const pass = JSON.stringify(got) === JSON.stringify(exp);
  console.log(`${pass ? "✓" : "✗"} ${label} -> ${JSON.stringify(got)} (exp ${JSON.stringify(exp)})`);
}

const lib = new Library([
  { id: 'dune', copyIds: ['dune-1', 'dune-2'] },
  { id: 'hobbit', copyIds: ['hobbit-1'] },
]);

// Loans
check('alice checks out dune at day 0', lib.checkout('dune', 'alice', 0), { copyId: 'dune-1', dueDate: 21 });
check('bob checks out dune at day 0', lib.checkout('dune', 'bob', 0), { copyId: 'dune-2', dueDate: 21 });
check('carol: no dune copies left', lib.checkout('dune', 'carol', 0), null);

// Holds and pickup
lib.placeHold('dune', 'carol');
lib.returnCopy('dune', 'dune-1', 5);
check('dave cannot take the copy reserved for carol', lib.checkout('dune', 'dave', 5), null);
check('carol picks up her reserved copy at day 7', lib.checkout('dune', 'carol', 7), { copyId: 'dune-1', dueDate: 28 });

// A return with nobody waiting frees the copy
lib.returnCopy('dune', 'dune-2', 8);
check('dave takes the freed copy', lib.checkout('dune', 'dave', 8), { copyId: 'dune-2', dueDate: 29 });

// Expired holds pass down the line
lib.checkout('hobbit', 'alice', 0);
lib.placeHold('hobbit', 'bob');
lib.placeHold('hobbit', 'carol');
lib.returnCopy('hobbit', 'hobbit-1', 2);          // reserved for bob until day 5
lib.runSweep(5);                                  // not expired yet
check('carol cannot take bob\'s copy at day 5', lib.checkout('hobbit', 'carol', 5), null);
lib.runSweep(6);                                  // bob no-showed: carol's until day 9
check('bob\'s hold has lapsed', lib.checkout('hobbit', 'bob', 6), null);
check('carol picks up hobbit at day 6', lib.checkout('hobbit', 'carol', 6), { copyId: 'hobbit-1', dueDate: 27 });

// An expired hold with nobody waiting frees the copy
lib.placeHold('dune', 'erin');
lib.returnCopy('dune', 'dune-1', 10);             // reserved for erin until day 13
lib.runSweep(14);
check('erin no-showed; the copy is free again', lib.checkout('dune', 'frank', 14), { copyId: 'dune-1', dueDate: 35 });

// Unknown title
let threw = false;
try { lib.checkout('nope', 'alice', 0); } catch { threw = true; }
check('unknown title throws', threw, true);
