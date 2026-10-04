// URL shortener — LLD practice
//
// Accept a URL and return a short code for it; resolve a short code back to
// its URL. Codes expire. Time is injected by the caller on every call (`now`),
// and `expiration` is an absolute time: a code is live while now < expiration
// and dead from the instant now >= expiration.
//
// Implement:
//   generateShortcode(url, expiration, now, suppliedCode?): return a code for url.
//     Without suppliedCode:
//       - if url already has one or more live codes, return the earliest-created
//         of them (the same URL keeps returning the same code);
//       - otherwise create a new code that has never been issued by this
//         shortener before, bind it to url until `expiration`, and return it.
//     With suppliedCode:
//       - if it is live and bound to this url, return it unchanged;
//       - if it is live and bound to a different url, throw, and change nothing
//         (the failed call must not record anything);
//       - if it is unknown or dead, bind it to url until `expiration` and
//         return it. A url may hold several codes at once.
//   getUrl(shortcode, now): the url the code is bound to if it is live at
//     `now`, else null (unknown, empty, or dead).
//
// Constraints:
//   - Codes are case sensitive; URLs are compared exactly (a trailing slash
//     makes a different URL).
//   - Reads don't change what later reads see: `now` is not guaranteed to be
//     monotonic across calls, and a read at an earlier time after a read at a
//     later time must still see the code as live.
//   - Generated codes must stay distinct at volume (thousands of URLs).

type Entry = { url: string, expiration: number };

class MapOfLists<K, V> {
  map: Map<K, V[]>;
  
  constructor() {
    this.map = new Map();
  }

  add(key: K, val: V): void {
    const existing = this.map.get(key);
    if(existing !== undefined) {
      existing.push(val);
    } else {
      this.map.set(key, [val]);
    }
  }

  remove(key: K, val: V) {
    const existing = this.map.get(key);
    if (existing === undefined) {
      return;
    }

    const index = existing.findIndex(existingVal => existingVal === val);
    if (index >= 0) {
      existing.splice(index, 1);
    }

    if (existing.length === 0) {
      this.map.delete(key);
    }
  }

  get(key: K): V[] {
    const existing = this.map.get(key);
    return existing === undefined ? [] : [...existing];
  }
}

class CodeStorage {
  private codes: Map<string, Entry>;
  private urls: MapOfLists<string, string>;

  constructor() {
    this.codes = new Map();
    this.urls = new MapOfLists();
  }

  link(url: string, code: string, expiration: number): void {
    this.unlink(code);
    this.codes.set(code, { url, expiration });
    this.urls.add(url, code);
  }

  unlink(code: string): void {
    const url = this.codes.get(code);
    if (url === undefined) {
      return;
    }
    this.codes.delete(code);
    this.urls.remove(url.url, code);
  }

  codesFor(url: string): string[] {
    return this.urls.get(url);
  } 

  urlFor(code: string, now: number): string | undefined {
    const entry = this.codes.get(code);
    if (entry === undefined || entry.expiration <= now) {
      return;
    }

    return entry.url;
  }

  hasCode(code: string): boolean {
    return this.codes.has(code);
  }

}

class UrlShortener {

  storage: CodeStorage;

  constructor() {
    this.storage = new CodeStorage();
  }
  
  generateShortcode(url: string, expiration: number, now: number, suppliedCode?: string): string {
    // validate: if a code is provided, have we seen it before? If so, does it match this URL? If not, throw. If so, return 
    if(suppliedCode !== undefined) {
      // check if we've seen this code before
      const existingUrl = this.storage.urlFor(suppliedCode, now);
      // if so, check if it matches the provided URL. If not, throw. If so, return supplied code
      if(existingUrl !== undefined) {
        if (existingUrl !== url) {
          throw new Error('This code has already exists for another URL');
        } else {
          return suppliedCode;
        }
      }
    // if they didn't supply one, have we seen this URL before? if so, return the first stored code
    } else {
      // get all codes for this URL
      const existingCodes = this.storage.codesFor(url);
      for(let existingCode of existingCodes) {
        const urlForCode = this.storage.urlFor(existingCode, now); 
        if (urlForCode !== undefined) {
          return existingCode;
        }
      }
    }
 
    let code = suppliedCode ?? '';
    while(code === '') {
      const candidate = this._makeCode();
      if (!this.storage.hasCode(candidate)) {
        code = candidate;
      }
    }

    this.storage.link(url, code, expiration);
    return code;
  }

  getUrl(shortcode: string, now: number): string | null {
    const url = this.storage.urlFor(shortcode, now);
    return url ?? null;
  }

  _makeCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for(let i = 0;i < 6;i++) {
      let index = Math.floor(Math.random() * chars.length);
      code += chars[index];
    }
    
    return code;
  }
}

// ---- test harness ----
let passed = 0;
let failed = 0;

function check(label: string, actual: unknown, expected: unknown): void {
  const pass = actual === expected;
  pass ? passed++ : failed++;
  console.log(`${pass ? '✓' : '✗'} ${label} -> ${JSON.stringify(actual)} (exp ${JSON.stringify(expected)})`);
}

function checkThrows(label: string, fn: () => unknown): void {
  let threw = false;
  try {
    fn();
  } catch {
    threw = true;
  }
  check(label, threw, true);
}

const FOREVER = 1_000_000;

// --- basics ---
{
  const s = new UrlShortener();
  const codeA = s.generateShortcode('https://example.com/a', FOREVER, 0);
  const codeB = s.generateShortcode('https://example.com/b', FOREVER, 0);

  check('resolves code A', s.getUrl(codeA, 0), 'https://example.com/a');
  check('resolves code B', s.getUrl(codeB, 0), 'https://example.com/b');
  check('distinct urls get distinct codes', codeA !== codeB, true);
  check('same url returns same code', s.generateShortcode('https://example.com/a', FOREVER, 0), codeA);
  check('unknown code returns null', s.getUrl('nope', 0), null);
  check('empty string is not a known code', s.getUrl('', 0), null);
}

// --- supplied codes ---
{
  const s = new UrlShortener();
  check('supplied code is returned', s.generateShortcode('https://a.com', FOREVER, 0, 'promo'), 'promo');
  check('supplied code resolves', s.getUrl('promo', 0), 'https://a.com');
  check('supplied code repeats cleanly', s.generateShortcode('https://a.com', FOREVER, 0, 'promo'), 'promo');
  check('no-code call returns the supplied code', s.generateShortcode('https://a.com', FOREVER, 0), 'promo');
}

// --- one url, many codes ---
{
  const s = new UrlShortener();
  const generated = s.generateShortcode('https://a.com', FOREVER, 0);
  s.generateShortcode('https://a.com', FOREVER, 0, 'promo');

  check('generated code resolves', s.getUrl(generated, 0), 'https://a.com');
  check('supplied code also resolves', s.getUrl('promo', 0), 'https://a.com');
  check('no-code call returns the first code', s.generateShortcode('https://a.com', FOREVER, 0), generated);
  check('a third code is accepted', s.generateShortcode('https://a.com', FOREVER, 0, 'promo2'), 'promo2');
  check('no-code call still returns the first code', s.generateShortcode('https://a.com', FOREVER, 0), generated);
}

// --- conflicts ---
{
  const s = new UrlShortener();
  s.generateShortcode('https://a.com', FOREVER, 0, 'promo');

  checkThrows('taken code rejects a different url', () => s.generateShortcode('https://b.com', FOREVER, 0, 'promo'));
  check('rejected call leaves the pair intact', s.getUrl('promo', 0), 'https://a.com');

  const codeB = s.generateShortcode('https://b.com', FOREVER, 0);
  check('the rejected url still gets its own code', s.getUrl(codeB, 0), 'https://b.com');
}

// --- a failed supply must not be recorded ---
{
  const s = new UrlShortener();
  s.generateShortcode('https://a.com', FOREVER, 0, 'taken');
  const first = s.generateShortcode('https://b.com', FOREVER, 0);
  try {
    s.generateShortcode('https://b.com', FOREVER, 0, 'taken');
  } catch {}
  check('failed supply does not become the first code', s.generateShortcode('https://b.com', FOREVER, 0), first);
  check('failed supply did not steal the code', s.getUrl('taken', 0), 'https://a.com');
}

// --- exact matching ---
{
  const s = new UrlShortener();
  s.generateShortcode('https://a.com', FOREVER, 0, 'AbC');
  check('codes are case sensitive', s.getUrl('abc', 0), null);
  check('the exact code resolves', s.getUrl('AbC', 0), 'https://a.com');

  const withSlash = s.generateShortcode('https://a.com/', FOREVER, 0);
  const withoutSlash = s.generateShortcode('https://a.com', FOREVER, 0);
  check('a trailing slash makes a different url', withSlash !== withoutSlash, true);
}

// --- the expiration boundary ---
{
  const s = new UrlShortener();
  s.generateShortcode('https://a.com', 100, 0, 'promo');

  check('alive one tick before the expiration', s.getUrl('promo', 99), 'https://a.com');
  check('dead exactly at the expiration', s.getUrl('promo', 100), null);
}

{
  const s = new UrlShortener();
  s.generateShortcode('https://a.com', 100, 0, 'promo');
  check('dead after the expiration', s.getUrl('promo', 101), null);
  check('still dead on a later read', s.getUrl('promo', 200), null);
  check('still alive on a read before the expiration', s.getUrl('promo', 0), 'https://a.com');
}

// --- cleanup frees the code for another url ---
{
  const s = new UrlShortener();
  s.generateShortcode('https://a.com', 100, 0, 'promo');
  s.getUrl('promo', 100);

  check('the expired code is free', s.generateShortcode('https://b.com', 500, 200, 'promo'), 'promo');
  check('the code now resolves to the new url', s.getUrl('promo', 200), 'https://b.com');
}

// --- an expired code is free even without a read to clean it up ---
{
  const s = new UrlShortener();
  s.generateShortcode('https://a.com', 100, 0, 'promo');

  check('the expired code is free on a write', s.generateShortcode('https://b.com', 500, 200, 'promo'), 'promo');
  check('the code now resolves to the new url', s.getUrl('promo', 200), 'https://b.com');
}

// --- cleanup of the last code for a url ---
{
  const s = new UrlShortener();
  const first = s.generateShortcode('https://a.com', 100, 0);
  s.getUrl(first, 100);

  const second = s.generateShortcode('https://a.com', 500, 200);
  check('the url gets a fresh code', second !== first, true);
  check('the fresh code resolves', s.getUrl(second, 200), 'https://a.com');
  check('the old code stays dead', s.getUrl(first, 200), null);
}

// --- cleanup of one code among several ---
{
  const s = new UrlShortener();
  const first = s.generateShortcode('https://a.com', 100, 0);
  s.generateShortcode('https://a.com', 500, 0, 'promo');
  s.getUrl(first, 100);

  check('the surviving code still resolves', s.getUrl('promo', 200), 'https://a.com');
  check('no-code call returns the surviving code', s.generateShortcode('https://a.com', 500, 200), 'promo');
  check('the expired code stays dead', s.getUrl(first, 200), null);
}

// --- a dead code is never handed out ---
{
  const s = new UrlShortener();
  const first = s.generateShortcode('https://a.com', 100, 0);
  const next = s.generateShortcode('https://a.com', 500, 200);

  check('a live code comes back after the first one dies', s.getUrl(next, 200), 'https://a.com');
  check('the dead code is not reused', next !== first, true);
}

// --- volume ---
{
  const s = new UrlShortener();
  const seen = new Set<string>();
  let duplicates = 0;
  let unresolved = 0;
  let stillAlive = 0;

  const codes: string[] = [];
  for (let i = 0; i < 2000; i++) {
    const url = `https://example.com/${i}`;
    const code = s.generateShortcode(url, i % 2 === 0 ? 100 : FOREVER, 0);
    if (seen.has(code)) duplicates++;
    seen.add(code);
    codes.push(code);
    if (s.getUrl(code, 0) !== url) unresolved++;
  }

  for (let i = 0; i < 2000; i++) {
    if (i % 2 === 0 && s.getUrl(codes[i], 100) !== null) stillAlive++;
  }

  check('2000 urls produce 2000 distinct codes', duplicates, 0);
  check('every code resolves before it expires', unresolved, 0);
  check('every expired code reads as dead', stillAlive, 0);
}

console.log(`\n${passed} passed, ${failed} failed`);
