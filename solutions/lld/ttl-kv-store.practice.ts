// In-memory key-value store with TTL — LLD/processing practice.
//
// Process a newline-separated input string of commands, one per line, and
// produce a newline-separated output string, one line of result per line of
// input. Store is in-memory only.
//
// Each line is: <time> <COMMAND> <args...>, where <time> is a non-negative
// integer clock (explicit per-line, not wall-clock) that only ever increases
// or stays the same across lines.
//
// Commands:
//   SET <key> <value> <ttl>  — store key=value. It expires exactly <ttl>
//     time units after this command's <time>; a GET at or after that instant
//     must treat it as gone. Output: "OK"
//   GET <key>                — output the current value for key, or "null"
//     if the key was never set, has been deleted, or has expired.
//   DELETE <key>              — remove key if present. Output: "OK" either way.
//
// If a line doesn't match one of the above shapes, output:
//   "error: invalid input format"
//
// Write processCommands(input: string): string.

const SAMPLE_INPUT = `0 SET a 1 100
0 GET a
50 GET a
100 GET a
150 SET b 2 50
160 GET b
160 SET a 3 1000
170 GET a
170 DELETE b
171 GET b
171 SET c 9 0
171 GET c
171 DELETE z
171 GET z
banana`;

const EXPECTED_OUTPUT = `OK
1
1
null
OK
2
OK
3
OK
null
OK
null
OK
null
error: invalid input format`;

type GetCommand = { now: number, verb: 'GET', key: string }; 
type SetCommand = { now: number, verb: 'SET', key: string, value: string, ttl: number }; 
type DeleteCommand = { now: number, verb: 'DELETE', key: string }; 

type Command = GetCommand | SetCommand | DeleteCommand;

type ValueWithTtl = { value: string, expiration: number };

const store = new Map<string, ValueWithTtl>();

function processCommands(input: string): string {
   const lines = input.split('\n');
   const output: string[] = [];
   for (const line of lines) {
     try {
       const command = parseCommand(line);
       const result = processCommand(command);
       output.push(result ?? 'null');
     } catch(e) {
       output.push(`error: ${e.message}`);
     }
   }

   return output.join('\n');
}

function parseCommand(input: string): Command {
  const line = input.split(' ');
  if (line.length < 3) {
    throw new Error('invalid input format');
  }

  const [time, verb, ...args] = line;
  const now = Number.parseInt(time);

  switch(verb) {
    case 'GET':
    case 'DELETE': {
      const [key] = args; 
      return { now, verb, key }; 
    } 
    case 'SET': {
      const [key, value, ttl] = args;
      const ttlTime = Number.parseInt(ttl)
      return { now, verb, key, value, ttl: ttlTime }; 
    }
    default:
      throw new Error(`${verb} is not one of GET, DELETE, SET`);
  }
}

function get(command: GetCommand): string | null {
   const entry = store.get(command.key); 
   if (entry === undefined) {
     return null;
   }

   if (_isExpired(command.now, entry.expiration)) {
     remove({ now: command.now, key: command.key, verb: 'DELETE' });
     return null;
   }

   return entry.value;
}

function set(command: SetCommand) {
  const expiration = command.ttl + command.now;
  store.set(command.key, { value: command.value, expiration });
  return 'OK';
}

function remove(command: DeleteCommand): string {
  store.delete(command.key);
  return 'OK';
}

function processCommand(command: Command) {
  switch(command.verb) {
    case 'GET': 
      return get(command);
    case 'SET':
      return set(command);
    case 'DELETE':
      return remove(command);
  }
}

function _isExpired(now: number, expiration: number): boolean {
  return expiration <= now;
}

// ---- test harness ----
const inputLines = SAMPLE_INPUT.split('\n');
const expectedLines = EXPECTED_OUTPUT.split('\n');
const actualLines = (processCommands(SAMPLE_INPUT) ?? '').split('\n');

for (let i = 0; i < expectedLines.length; i++) {
  const pass = actualLines[i] === expectedLines[i];
  console.log(`${pass ? "✓" : "✗"} [${inputLines[i]}] -> ${actualLines[i]} (exp ${expectedLines[i]})`);
}
