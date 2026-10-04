// Rate limiter — LLD practice. Fixed window (rolling-from-first-request), in-memory.
// Implement isRequestAllowed

// One active window per (user, endpoint): when it dies, and how much of its
// budget is spent.
interface Window {
  expiresAt: number; // epoch ms; this window is dead once now >= expiresAt
  count: number;     // requests counted in this window so far
}

class RateLimiter {
  private windows = new Map<string, Window>();

  // limit = max requests per window; windowMs = window length in ms
  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  // Returns true if this request is allowed and counts it; false if it's over
  // the cap. `now` is an epoch-ms timestamp injected by the caller.
  isRequestAllowed(userId: string, endpoint: string, now: number): boolean {
    const key = this._makeKey(userId, endpoint);
    let count: number;
    const currentWindow = this.windows.get(key);

    if (!currentWindow || now >= currentWindow.expiresAt) {
      count = this._resetWindow(key, now);
    } else {
      count = this._incrementWindow(key, currentWindow);
    }

    return count <= this.limit;
  }

  private _incrementWindow(key: string, window: Window): number {
    const nextCount = window.count + 1;
    this.windows.set(key, {
      ...window,
      count: nextCount,
    });

    return nextCount;
  }

  private _resetWindow(key: string, now: number): number {
    const nextCount = 1;

    this.windows.set(key, {
      expiresAt: now + this.windowMs,
      count: nextCount
    } as Window);

    return nextCount;
  }

  private _makeKey(userId: string, endpoint: string) {
    return `${userId}:${endpoint}`;
  }
}

// --- quick test harness ---
const MINUTE = 60_000;

function check(label: string, got: unknown, exp: unknown): void {
  const pass = JSON.stringify(got) === JSON.stringify(exp);
  console.log(`${pass ? "✓" : "✗"} ${label} -> ${JSON.stringify(got)} (exp ${JSON.stringify(exp)})`);
}

const limiter = new RateLimiter(3, MINUTE); // 3 requests / minute
const at = (n: number) => limiter.isRequestAllowed('alice', '/search', n);

// Window 1 (t=0)
check('alice t=0 (1/3)', at(0), true);
check('alice t=100 (2/3)', at(100), true);
check('alice t=200 (3/3)', at(200), true);
check('alice t=300 (over cap, same window)', at(300), false);

// Window rolls over
check('alice t=60_000 (fresh window, 1/3)', at(MINUTE), true);
check('alice t=60_010 (2/3)', at(MINUTE + 10), true);

// Different key is independent
check("bob /search t=300 (bob's own window)", limiter.isRequestAllowed('bob', '/search', 300), true);
check('alice /login t=300 (different endpoint)', limiter.isRequestAllowed('alice', '/login', 300), true);
