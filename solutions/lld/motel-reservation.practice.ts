// Motel reservation system — LLD practice

type Day = number;

interface Reservation {
  id: string;
  roomId: string;
  guestId: string;
  checkIn: Day;
  checkOut: Day;
}

interface Room {
  id: string;
  reservations: Reservation[];
}

class Motel {
  private rooms: Room[];
  private reservations = new Map<string, string>();
  private nextReservationId = 1;

  constructor(roomIds: string[]) {
    this.rooms = roomIds.map(id => ({ id, reservations: [] }));
  }

  private findRoom(roomId: string): Room {
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) throw new Error(`no such room: ${roomId}`);
    return room;
  }

  isAvailable(roomId: string, checkIn: Day, checkOut: Day): boolean {
    const room = this.findRoom(roomId);
    for (const { checkIn: existingCheckIn, checkOut: existingCheckout } of room.reservations) {
      if (checkIn < existingCheckout && checkOut > existingCheckIn) {
        return false;
      }
    }

    return true;
  }

  book(roomId: string, guestId: string, checkIn: Day, checkOut: Day): string | null {
    const room = this.findRoom(roomId);
    if (!this.isAvailable(roomId, checkIn, checkOut)) {
      return null;
    }

    const reservationId = `res-${this.nextReservationId++}`;
    room.reservations.push({ id: reservationId, roomId, guestId, checkIn, checkOut });
    this.reservations.set(reservationId, roomId);
    return reservationId;
  }

  cancel(reservationId: string): void {
    const roomId = this.reservations.get(reservationId);
    if (roomId === undefined) return;
    const room = this.findRoom(roomId);
    room.reservations = room.reservations.filter(reservation => reservation.id !== reservationId);
    this.reservations.delete(reservationId);
  }

  availableRooms(checkIn: Day, checkOut: Day): string[] {
    return this.rooms.filter(room => this.isAvailable(room.id, checkIn, checkOut)).map(room => room.id);
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
