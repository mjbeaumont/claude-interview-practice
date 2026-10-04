// Library lending system — LLD practice

type Day = number;

const LOAN_DAYS = 21;
const HOLD_DAYS = 3;

type Copy =
  | { id: string; state: 'available' }
  | { id: string; state: 'checked-out'; borrowerId: string; dueDate: Day }
  | { id: string; state: 'reserved'; borrowerId: string; holdExpires: Day };

interface Title {
  id: string;
  copies: Copy[];
  holds: string[];
}

class Library {
  private catalog: Title[];

  constructor(titles: { id: string; copyIds: string[] }[]) {
    this.catalog = titles.map(({ id, copyIds }) => ({
      id,
      copies: copyIds.map((copyId): Copy => ({ id: copyId, state: 'available' })),
      holds: [],
    }));
  }

  private findTitle(titleId: string): Title {
    const title = this.catalog.find(t => t.id === titleId);
    if (!title) throw new Error(`no such title: ${titleId}`);
    return title;
  }

  private updateCopy(copies: Copy[], newCopy: Copy) {
    const idx = copies.findIndex(copy => copy.id === newCopy.id);
    copies[idx] = newCopy;
  }

  checkout(titleId: string, memberId: string, now: Day): { copyId: string; dueDate: Day } | null {
    const title = this.findTitle(titleId);
    const copy =
      title.copies.find(copy => copy.state === 'reserved' && copy.borrowerId === memberId) ??
      title.copies.find(copy => copy.state === 'available');
    if (typeof copy === 'undefined') {
      return null;
    }

    const checkedOutCopy: Copy = {
      id: copy.id,
      state: 'checked-out',
      borrowerId: memberId,
      dueDate: now + LOAN_DAYS,
    };

    this.updateCopy(title.copies, checkedOutCopy);

    return { copyId: checkedOutCopy.id, dueDate: checkedOutCopy.dueDate };
  }

  placeHold(titleId: string, memberId: string): void {
    this.findTitle(titleId).holds.push(memberId);
  }

  returnCopy(titleId: string, copyId: string, now: Day): void {
    const title = this.findTitle(titleId);

    const availableCopy: Copy = {
      id: copyId,
      state: 'available',
    };

    this.updateCopy(title.copies, availableCopy);

    if (title.holds.length) {
      const nextBorrowerId = title.holds.shift()!;
      const heldCopy: Copy = {
        id: copyId,
        state: 'reserved',
        borrowerId: nextBorrowerId,
        holdExpires: now + HOLD_DAYS,
      };

      this.updateCopy(title.copies, heldCopy);
    }
  }

  runSweep(now: Day): void {
    for (const title of this.catalog) {
      for (const copy of title.copies) {
        if (copy.state === 'reserved' && now > copy.holdExpires) {
          this.returnCopy(title.id, copy.id, now);
        }
      }
    }
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
