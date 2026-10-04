interface Message {
  text: string;
  sent_at: number;
  readCount: number;
}

type MessageWithId = Message & {
  id: number;
}

interface ProcessingMessage {
  message: MessageWithId,
  processingStart: number;
}

export class MessageQueue {
  messages: MessageWithId[];
  deadLetterQueue: MessageWithId[];
  nextMessageId: number;
  processing: Map<number, ProcessingMessage>;
  timeout: number;
  retries: number;

  constructor(timeout: number, retries: number) {
    this.messages = [];
    this.deadLetterQueue = [];
    this.nextMessageId = 0;
    this.processing = new Map();
    this.timeout = timeout;
    this.retries = retries;
  }

  enqueue(text: string, sent_at: number): number {
    const currentMessageId = this.nextMessageId;
    this.messages.push({ text, sent_at, id: this.nextMessageId, readCount: 0 });
    this.nextMessageId++;
    return currentMessageId;
  }

  dequeue(currentTime: number): MessageWithId | null {
    this._reenqueue(currentTime);
    const currentMessage = this.messages.shift() || null;
    if (currentMessage !== null) {
      const existing = this.processing.get(currentMessage.id);
      this.processing.set(currentMessage.id, { 
        message: currentMessage, 
        processingStart: currentTime, 
      });
    }

    return currentMessage;
  }

  acknowledge(messageId: number): void {
    this.processing.delete(messageId);
  }

  dequeueDLQ(): MessageWithId | null {
    return this.deadLetterQueue.shift() ?? null;
  }

  _reenqueue(currentTime: number) {
    const processingMesssages = this.processing.values();
    for(const processingMessage of processingMesssages) {
      if (currentTime - processingMessage.processingStart >= this.timeout) {
        processingMessage.message.readCount++;
        if (processingMessage.message.readCount > this.retries) {
          this.deadLetterQueue.push(processingMessage.message);
        } else {
          this.messages.push(processingMessage.message);
        }
        this.processing.delete(processingMessage.message.id);
      }
    }
  }
}
