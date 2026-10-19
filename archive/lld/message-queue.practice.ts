// Message queue — LLD practice
//
// An in-memory message queue with acknowledgment, redelivery, and a dead
// letter queue. Time is injected by the caller (`sent_at`, `currentTime`).
// Built in three stages (the harness has one section per stage):
//
// 1. Basic delivery
//    constructor(timeout, retries): create an empty queue. Queues are
//      independent of each other.
//    enqueue(text, sent_at): add a message and return its id. Every enqueue
//      gets a distinct id, even for identical text.
//    dequeue(currentTime): return the next message ({ id, text, sent_at }) in
//      the order they were enqueued, or null if nothing is available.
//    acknowledge(messageId): the consumer is done; the message is gone for good.
//
// 2. Acknowledgment and redelivery
//    - A dequeued message is "in flight": it is invisible to dequeue until it
//      is acknowledged or `timeout` time units pass since that delivery.
//    - An unacknowledged message becomes deliverable again once
//      currentTime - deliveryTime >= timeout. It keeps its id and sent_at, is
//      delivered once per timeout (not twice), and each redelivery starts a
//      fresh timeout.
//    - An acknowledged message is never redelivered, including when
//      acknowledged on a redelivery.
//    - In-flight messages don't block others: later and newly enqueued
//      messages are still delivered while earlier ones are in flight.
//    - acknowledge on an unknown id, or twice on the same id, is a no-op and
//      must not throw.
//    - At volume (10k messages), nothing is lost or duplicated.
//
// 3. Dead letter queue
//    - `retries` is the number of redeliveries allowed: a message is delivered
//      at most retries + 1 times (retries = 0 means exactly once).
//    - When the final delivery times out unacknowledged, the message moves to
//      the dead letter queue. It is not dead while that last delivery is still
//      in flight, and the main queue never delivers it again.
//    - A message acknowledged on any delivery never becomes dead.
//    - dequeueDLQ(): return the next dead message (keeping its id and
//      sent_at), or null if none. Each dead message is returned once.
//    - A dying message does not block healthy ones.

interface Message {
  text: string;
  sent_at: number;
}

type MessageWithId = Message & {
  id: number;
}

export class MessageQueue {
  constructor(timeout: number, retries: number) {

  }

  enqueue(text: string, sent_at: number): number {

  }

  dequeue(currentTime: number): MessageWithId | null {

  }

  acknowledge(messageId: number): void {

  }

  dequeueDLQ(): MessageWithId | null {

  }
}
