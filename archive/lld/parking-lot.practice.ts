// Parking lot — LLD practice
//
// Model a single-level parking lot with `capacity` spots, numbered
// 0..capacity-1. The first `n` spots (0..n-1) are car spots; the rest
// (n..capacity-1) are motorcycle spots.
//   A car may only park in a car spot.
//   A motorcycle prefers a motorcycle spot, but takes a car spot if no
//   motorcycle spot is free.
// Implement:
//   constructor(capacity, n): build the lot.
//   park(vehicleId, vehicleType): assign the vehicle a free spot it is allowed
//     to use and return the spot number, or null if none is free. If the
//     vehicle is already parked, return its current spot (don't assign a
//     second one). On a fresh lot, spots of each kind fill in ascending order.
//   unpark(vehicleId): free the spot occupied by that vehicle. Unknown vehicle
//     is a no-op.
//   availableSpots(type): how many free spots that vehicle type could use —
//     'car' counts free car spots only; 'motorcycle' and 'all' count every
//     free spot.

type VehicleType = 'car' | 'motorcycle';

class ParkingLot {
  constructor(capacity: number, n: number) {

  }

  park(vehicleId: string, vehicleType: VehicleType): number | null {

  }

  unpark(vehicleId: string): void {

  }

  availableSpots(type: VehicleType | 'all'): number {

  }
}

// ---- test harness ----
const lot = new ParkingLot(5, 2);

const p1 = lot.park('car1', 'car');
console.log(`${p1 === 0 ? "✓" : "✗"} park(car1) = ${p1} (exp 0)`);

const p2 = lot.park('car2', 'car');
console.log(`${p2 === 1 ? "✓" : "✗"} park(car2) = ${p2} (exp 1)`);

const p3 = lot.park('car3', 'car');
console.log(`${p3 === null ? "✓" : "✗"} park(car3) = ${p3} (exp null, car spots full)`);

const a1 = lot.availableSpots('all');
console.log(`${a1 === 3 ? "✓" : "✗"} availableSpots(all) = ${a1} (exp 3)`);

const a2 = lot.availableSpots('car');
console.log(`${a2 === 0 ? "✓" : "✗"} availableSpots(car) = ${a2} (exp 0)`);

const p4 = lot.park('moto1', 'motorcycle');
console.log(`${p4 === 2 ? "✓" : "✗"} park(moto1) = ${p4} (exp 2)`);

const a3 = lot.availableSpots('all');
console.log(`${a3 === 2 ? "✓" : "✗"} availableSpots(all) = ${a3} (exp 2)`);

lot.unpark('car1');
const a4 = lot.availableSpots('all');
console.log(`${a4 === 3 ? "✓" : "✗"} availableSpots(all) after unpark(car1) = ${a4} (exp 3)`);

const a5 = lot.availableSpots('car');
console.log(`${a5 === 1 ? "✓" : "✗"} availableSpots(car) after unpark(car1) = ${a5} (exp 1)`);
