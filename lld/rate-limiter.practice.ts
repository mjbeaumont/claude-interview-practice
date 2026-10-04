// Rate limiter — LLD practice
//
// Implement an in-memory fixed-window rate limiter. Each (userId, endpoint)
// pair gets its own window of length windowMs allowing at most `limit` requests.
// The window starts at the first request and lasts windowMs; once it expires,
// the next request starts a fresh window.
//   isRequestAllowed(userId, endpoint, now): count this request and return true
//   if it is within the cap for the current window, false if it exceeds it.
//   `now` is an epoch-ms timestamp injected by the caller (no global clock).

class RateLimiter {
  constructor(limit: number, windowMs: number) {

  }

  isRequestAllowed(userId: string, endpoint: string, now: number): boolean {

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
