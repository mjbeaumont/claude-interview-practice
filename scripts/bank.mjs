// Practice bank: bank/<bucket>/ holds blank scaffolds, work/ holds the working copy.
//   node scripts/bank.mjs fresh <name>          copy a blank into work/ (always overwrites)
//   node scripts/bank.mjs clear                 empty work/
//   node scripts/bank.mjs bucket <name> <b>     move a blank to solid | ok | rough | new
//   node scripts/bank.mjs list                  show every bucket
import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const bankDir = join(root, "bank");
const workDir = join(root, "work");
const buckets = ["solid", "ok", "rough", "new"];
const suffix = ".practice.ts";

const names = (bucket) =>
  readdirSync(join(bankDir, bucket)).filter((f) => f.endsWith(suffix)).map((f) => f.slice(0, -suffix.length));

function find(query) {
  const all = buckets.flatMap((b) => names(b).map((n) => ({ bucket: b, name: n })));
  const exact = all.filter((e) => e.name === query);
  const hits = exact.length ? exact : all.filter((e) => e.name.includes(query));
  if (hits.length !== 1) {
    console.error(hits.length ? `ambiguous: ${hits.map((h) => h.name).join(", ")}` : `no problem matches "${query}"`);
    process.exit(1);
  }
  return hits[0];
}

const [cmd, a, b] = process.argv.slice(2);
if (cmd === "fresh" && a) {
  const { bucket, name } = find(a);
  mkdirSync(workDir, { recursive: true });
  copyFileSync(join(bankDir, bucket, name + suffix), join(workDir, name + suffix));
  console.log(`work/${name}${suffix}  (from ${bucket})`);
} else if (cmd === "clear") {
  rmSync(workDir, { recursive: true, force: true });
  mkdirSync(workDir);
  console.log("work/ cleared");
} else if (cmd === "bucket" && a && buckets.includes(b)) {
  const { bucket, name } = find(a);
  renameSync(join(bankDir, bucket, name + suffix), join(bankDir, b, name + suffix));
  console.log(`${name}: ${bucket} -> ${b}`);
} else if (cmd === "list") {
  for (const k of buckets) console.log(`${k} (${names(k).length}): ${names(k).join(", ")}`);
} else {
  console.error("usage: fresh <name> | clear | bucket <name> <solid|ok|rough|new> | list");
  process.exit(1);
}
