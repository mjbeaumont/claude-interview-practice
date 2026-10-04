// Motel reservation system — LLD practice
//
// A motel has a fixed set of rooms. Days are integers, and a stay covers the
// half-open range [checkIn, checkOut): a checkout on day 5 and a check-in on
// day 5 do NOT overlap.
//
//   new Motel(roomIds): the motel's rooms.
//   isAvailable(roomId, checkIn, checkOut): true if no reservation for that
//     room overlaps the range.
//   book(roomId, guestId, checkIn, checkOut): reserve the room if it's
//     available; return a unique reservation id, or null if it isn't.
//   cancel(reservationId): remove the reservation. Unknown ids are ignored.
//   availableRooms(checkIn, checkOut): ids of every room available for the
//     range, in the order the rooms were given.
//
// An unknown roomId throws.

class Motel {
  constructor(roomIds: string[]) {

  }

  isAvailable(roomId: string, checkIn: number, checkOut: number): boolean {

  }

  book(roomId: string, guestId: string, checkIn: number, checkOut: number): string | null {

  }

  cancel(reservationId: string): void {

  }

  availableRooms(checkIn: number, checkOut: number): string[] {

  }
}

// ---- test harness ----
const motel = new Motel(['room-101', 'room-102', 'room-103']);

const r1 = motel.book('room-101', 'alice', 0, 5);
console.log(`${r1 !== null ? "✓" : "✗"} book(room-101, alice, 0-5) succeeds (exp non-null)`);

const a1 = motel.isAvailable('room-101', 5, 10);
console.log(`${a1 === true ? "✓" : "✗"} isAvailable(room-101, 5-10) = ${a1} (exp true, back-to-back)`);

const r2 = motel.book('room-101', 'bob', 5, 10);
console.log(`${r2 !== null ? "✓" : "✗"} book(room-101, bob, 5-10) succeeds (exp non-null, adjacent ok)`);

const a2 = motel.isAvailable('room-101', 3, 7);
console.log(`${a2 === false ? "✓" : "✗"} isAvailable(room-101, 3-7) = ${a2} (exp false, spans both reservations)`);

const r3 = motel.book('room-101', 'carol', 3, 7);
console.log(`${r3 === null ? "✓" : "✗"} book(room-101, carol, 3-7) = ${r3} (exp null, overlaps)`);

const a3 = motel.isAvailable('room-101', 1, 3);
console.log(`${a3 === false ? "✓" : "✗"} isAvailable(room-101, 1-3) = ${a3} (exp false, fully inside alice's stay)`);

const a4 = motel.isAvailable('room-101', 10, 15);
console.log(`${a4 === true ? "✓" : "✗"} isAvailable(room-101, 10-15) = ${a4} (exp true, fully after)`);

const r4 = motel.book('room-102', 'dave', 0, 3);
console.log(`${r4 !== null ? "✓" : "✗"} book(room-102, dave, 0-3) succeeds (exp non-null)`);

const avail = motel.availableRooms(0, 3);
const availExpected = ['room-103'];
console.log(`${JSON.stringify(avail) === JSON.stringify(availExpected) ? "✓" : "✗"} availableRooms(0-3) = ${JSON.stringify(avail)} (exp ${JSON.stringify(availExpected)})`);

if (r2) motel.cancel(r2);
const a5 = motel.isAvailable('room-101', 5, 10);
console.log(`${a5 === true ? "✓" : "✗"} isAvailable(room-101, 5-10) after cancel = ${a5} (exp true)`);

const r5 = motel.book('room-103', 'eve', 2, 4);
console.log(`${r5 !== null ? "✓" : "✗"} book(room-103, eve, 2-4) succeeds (exp non-null)`);

const a6 = motel.isAvailable('room-103', 0, 10);
console.log(`${a6 === false ? "✓" : "✗"} isAvailable(room-103, 0-10) = ${a6} (exp false, query engulfs existing reservation)`);
