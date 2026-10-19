// Tag index — LLD practice
//
// Two classes, built in order.
//
// 1. MapOfLists — a store from a string key to an ordered list of string values.
//    add(key, value): append value to key's list, creating the key if absent.
//    remove(key, value): remove value from key's list, keeping the order of
//      the remaining values. When the last value goes, the key itself must be
//      removed — no key is ever left holding an empty list.
//    get(key): the key's values in insertion order, or [] for an absent key.
//      The result is always a fresh copy: mutating it must never change the
//      store (and must never create a key), and two reads return different
//      arrays.
//    The harness inspects the `cache` field (a Map from key to values) to
//    check that no empty or stray keys remain.
//
// 2. TagIndex — a two-way index between tags and document ids.
//    add(tag, docId): record the pair.
//    remove(tag, docId): drop the pair; a single call must update both
//      directions.
//    docsFor(tag): doc ids carrying that tag, in the order they were added,
//      or [] if none.
//    tagsFor(docId): tags on that doc, in the order they were added, or [] if
//      none.
//    A removed pair can be added back. Once every pair is removed, both
//    directions hold no keys. The harness inspects the `tags` (tag -> docs)
//    and `docs` (doc -> tags) fields directly.

class MapOfLists {
  cache: Map<string, string[]>;

  constructor() {

  }

  add(key: string, value: string): void {

  }

  remove(key: string, value: string): void {

  }

  get(key: string): string[] {

  }
}

class TagIndex {
  tags: MapOfLists;
  docs: MapOfLists;

  constructor() {

  }

  add(tag: string, docId: string): void {

  }

  remove(tag: string, docId: string): void {

  }

  docsFor(tag: string): string[] {

  }

  tagsFor(docId: string): string[] {

  }
}

// ---- test harness ----
let passed = 0;
let failed = 0;

function check(label: string, actual: unknown, expected: unknown): void {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  pass ? passed++ : failed++;
  console.log(`${pass ? '✓' : '✗'} ${label} -> ${JSON.stringify(actual)} (exp ${JSON.stringify(expected)})`);
}

// --- MapOfLists on its own ---
{
  const m = new MapOfLists();
  check('an absent key reads as empty', m.get('a'), []);

  m.add('a', 'x');
  check('one value reads back', m.get('a'), ['x']);

  m.add('a', 'y');
  check('a second value appends', m.get('a'), ['x', 'y']);

  m.remove('a', 'x');
  check('the first value goes and the order holds', m.get('a'), ['y']);

  m.remove('a', 'y');
  check('the last value goes', m.get('a'), []);
  check('the key is gone, not empty', m.cache?.has('a'), false);
  check('no stray keys remain', m.cache?.size, 0);
}

// --- MapOfLists never hands out the stored list ---
{
  const m = new MapOfLists();
  m.add('a', 'x');

  const handed = m.get('a');
  handed?.push('y');
  check('a push into the result leaves the map alone', m.get('a'), ['x']);

  check('two reads are different arrays', m.get('a') === m.get('a'), false);

  const empty = m.get('nothing');
  empty?.push('z');
  check('a push into an empty result creates no key', m.get('nothing'), []);
  check('a push into an empty result adds no key', m.cache?.has('nothing'), false);
}

// --- MapOfLists keys stay independent ---
{
  const m = new MapOfLists();
  m.add('a', 'x');
  m.add('b', 'x');

  m.remove('a', 'x');
  check('the removed key is gone', m.get('a'), []);
  check('the other key keeps its value', m.get('b'), ['x']);
  check('exactly one key remains', m.cache?.size, 1);
}

// --- TagIndex both ways ---
{
  const s = new TagIndex();
  check('an absent tag reads as empty', s.docsFor('sql'), []);
  check('an absent doc reads as empty', s.tagsFor('d1'), []);

  s.add('sql', 'd1');
  check('the forward read sees the pair', s.docsFor('sql'), ['d1']);
  check('the reverse read sees the pair', s.tagsFor('d1'), ['sql']);

  s.add('sql', 'd2');
  s.add('css', 'd1');
  check('one tag holds two docs', s.docsFor('sql'), ['d1', 'd2']);
  check('one doc holds two tags', s.tagsFor('d1'), ['sql', 'css']);
  check('the second doc holds one tag', s.tagsFor('d2'), ['sql']);
}

// --- one remove updates both directions ---
{
  const s = new TagIndex();
  s.add('sql', 'd1');
  s.add('sql', 'd2');
  s.add('css', 'd1');

  s.remove('sql', 'd1');
  check('the forward read drops the doc', s.docsFor('sql'), ['d2']);
  check('the reverse read drops the tag', s.tagsFor('d1'), ['css']);
  check('the untouched pair survives', s.docsFor('css'), ['d1']);
}

// --- the last pair empties both sides ---
{
  const s = new TagIndex();
  s.add('sql', 'd1');
  s.remove('sql', 'd1');

  check('the tag reads empty', s.docsFor('sql'), []);
  check('the doc reads empty', s.tagsFor('d1'), []);
  check('the forward map holds no keys', s.tags?.cache?.size, 0);
  check('the reverse map holds no keys', s.docs?.cache?.size, 0);
}

// --- a pair comes back after it goes ---
{
  const s = new TagIndex();
  s.add('sql', 'd1');
  s.remove('sql', 'd1');
  s.add('sql', 'd1');

  check('the forward read rebuilds', s.docsFor('sql'), ['d1']);
  check('the reverse read rebuilds', s.tagsFor('d1'), ['sql']);
}

// --- volume, both directions ---
{
  const s = new TagIndex();
  const TAGS = 100;
  const DOCS = 5;

  for (let t = 0; t < TAGS; t++) {
    for (let d = 0; d < DOCS; d++) s.add(`tag${t}`, `doc${d}`);
  }
  check('every tag holds every doc', s.tags?.cache?.size, TAGS);
  check('every doc holds every tag', s.docs?.cache?.size, DOCS);
  check('a sampled tag is complete', s.docsFor('tag77')?.length, DOCS);
  check('a sampled doc is complete', s.tagsFor('doc3')?.length, TAGS);

  for (let t = 0; t < TAGS; t++) {
    for (let d = 0; d < DOCS; d++) s.remove(`tag${t}`, `doc${d}`);
  }
  check('the forward map empties completely', s.tags?.cache?.size, 0);
  check('the reverse map empties completely', s.docs?.cache?.size, 0);
}

console.log(`\n${passed} passed, ${failed} failed`);
