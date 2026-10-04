// Parking lot — LLD practice
//
// Model a single-level parking lot with `capacity` spots, numbered
// 0..capacity-1. Spots 0..n-1 are car spots; the rest are motorcycle spots.
// A car parks only in a car spot; a motorcycle prefers a motorcycle spot and
// falls back to a car spot. Implement:
//   park(vehicleId, vehicleType): return the assigned spot, the current spot
//     if already parked, or null if no allowed spot is free.
//   unpark(vehicleId): free the vehicle's spot. Unknown vehicle is a no-op.
//   availableSpots(type): free spots that type could use ('car' counts car
//     spots only; 'motorcycle' and 'all' count every free spot).


type VehicleType = 'car' | 'motorcycle';

type Spots = {
  car: number[],
  motorcycle: number[]
}

class ParkingLot {
  openSpots: Spots;
  parkingMap: Map<string, number>;
  carSpots: number;

  constructor(capacity: number, n: number) {
    this.openSpots = {
      car: [],
      motorcycle: [],
    }; 
    for(let i = 0;i < capacity;i++) {
      if (i < n) {
        this.openSpots.car.push(i);
      } else {
        this.openSpots.motorcycle.push(i);
      }
    }
    this.parkingMap = new Map<string, number>();
    this.carSpots = n;
  }

  park(vehicleId: string, vehicleType: VehicleType): number | null {
     const alreadyParked = this.parkingMap.get(vehicleId);
     if(alreadyParked !== undefined) return alreadyParked;

     if(this.availableSpots(vehicleType) > 0) {
       let nextSpot: number;
       if (vehicleType === 'car') {
         nextSpot = this.openSpots.car.shift()!;
       } else {
         if (this.openSpots.motorcycle.length) {
           nextSpot = this.openSpots.motorcycle.shift()!;
         } else {
           nextSpot = this.openSpots.car.shift()!;
         }
       }
       this.parkingMap.set(vehicleId, nextSpot);
       return nextSpot;
     }

     return null;
  }

  unpark(vehicleId: string): void {
    const alreadyParked = this.parkingMap.get(vehicleId);
    if (alreadyParked !== undefined) {
      this.parkingMap.delete(vehicleId);
      if (alreadyParked < this.carSpots) {
        this.openSpots.car.unshift(alreadyParked);
      } else {
        this.openSpots.motorcycle.unshift(alreadyParked); 
      }
    }
  }

  availableSpots(type: VehicleType | 'all'): number {
    return (type === 'car') 
      ? this.openSpots.car.length 
      : this.openSpots.car.length + this.openSpots.motorcycle.length;
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
