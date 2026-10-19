// Priority Queue.
//
// Implement a generic priority queue ordered by a comparator passed to the
// constructor. cmp(a, b) < 0 means a comes out before b. With minComparator
// the queue yields the smallest number first. Insert and extract in O(log n),
// peek in O(1).
//
// Contract:
//   push(x)  — insert x
//   pop()    — remove and return the front element (first by cmp); undefined if empty
//   peek()   — return the front element without removing it; undefined if empty
//   size()   — number of elements currently in the queue
//
// Duplicates are allowed.
//   new PriorityQueue(minComparator), push 5, 3, 8, 1  then pop, pop  -> 1, 3
//   pop on an empty queue                                             -> undefined

type Cmp<T> = (a: T, b: T) => number;

export const minComparator: Cmp<number> = (a, b) => a - b;
export const maxComparator: Cmp<number> = (a, b) => b - a;

export class PriorityQueue<T> {
  elements: T[];
  cmp: Cmp<T>;

  constructor(cmp: Cmp<T>) {
     this.elements = [];
     this.cmp = cmp;
  }

  size(): number {
    return this.elements.length; 

  }

  peek(): T | undefined {
    return this.elements[0];
  }

  push(x: T): void {
    this.elements.push(x); 
    let currentChild = this.elements.length - 1;
    while (true) {
      const parent = this._parent(currentChild);
      if (this.cmp(this.elements[parent], this.elements[currentChild]) > 0) {
        this._swap(parent, currentChild);
        currentChild = parent;
      } else {
        break;
      }
    }
  }

  pop(): T | undefined {

    const result = this.elements[0];
    const newTop = this.elements.pop();
    
    if (!this.size()) {
      return result;
    }

    let winner = 0;
    this.elements[0] = newTop!;
 
    while(true) {
      const currentWinner = winner;
      const children = this._children(currentWinner);
      if(this.elements[children[0]] && this.cmp(this.elements[currentWinner], this.elements[children[0]]) > 0) {
        winner = children[0];
      }

      if (this.elements[children[1]] && this.cmp(this.elements[winner], this.elements[children[1]]) > 0) {
        winner = children[1];
      }

      if (winner === currentWinner) {
        break;
      }

      this._swap(winner, currentWinner);
    }

    return result;
  }
  
  _swap(a: number, b: number): void {
    [this.elements[a], this.elements[b]] = [this.elements[b], this.elements[a]];
  }

  _parent(c: number): number {
    return Math.ceil(c/2) - 1;
  }

  _children(c: number): [number, number] {
    return [(c * 2) + 1, (c * 2) + 2];  
  }
}

