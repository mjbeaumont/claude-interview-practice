#!/usr/bin/env python3
"""Set the active mode, or the candidate's target level.

Usage: set_mode.py interview hard|assisted
       set_mode.py drill recognition|invariant
       set_mode.py tutor|debrief|off
       set_mode.py level <level>   (e.g. senior, staff; saved to prep-settings.json)
       set_mode.py stall <step> <problem> <note>   (log a step the candidate stalled on)
"""
import json, os, sys, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATE = os.path.join(ROOT, ".interview-state")
SETTINGS = os.path.join(ROOT, "prep-settings.json")
VALID = ("interview", "tutor", "drill", "debrief", "off")
CHOICES = {
    "interview": ("hard", "assisted"),
    "drill": ("recognition", "invariant"),
}


def load(path):
    try:
        with open(path) as f:
            return json.load(f)
    except Exception:
        return {}


def save(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


mode = (sys.argv[1] if len(sys.argv) > 1 else "").strip().lower()

if mode == "level":
    level = " ".join(sys.argv[2:]).strip().lower()
    if not level:
        sys.exit("usage: set_mode.py level <level>, e.g. set_mode.py level staff")
    settings = load(SETTINGS)
    settings["level"] = level
    save(SETTINGS, settings)
    print("level: %s" % level)
    sys.exit(0)

if mode == "stall":
    if len(sys.argv) < 5:
        sys.exit('usage: set_mode.py stall <step> <problem> <note>')
    state = load(STATE)
    state.setdefault("stalls", []).append({
        "at": datetime.datetime.now().isoformat(timespec="seconds"),
        "step": sys.argv[2],
        "problem": sys.argv[3],
        "note": " ".join(sys.argv[4:])[:300],
    })
    save(STATE, state)
    print("stall logged: %s / %s" % (sys.argv[2], sys.argv[3]))
    sys.exit(0)

if mode not in VALID:
    sys.exit("mode must be one of: %s, or: level <level>" % ", ".join(VALID))

setting = None
if mode in CHOICES:
    setting = (sys.argv[2] if len(sys.argv) > 2 else "").strip().lower()
    if setting not in CHOICES[mode]:
        sys.exit("usage: set_mode.py %s %s" % (mode, "|".join(CHOICES[mode])))

if mode == "interview" and not load(SETTINGS).get("level"):
    sys.exit("no level set. Run /prep-plan, or: set_mode.py level <level>")

state = load(STATE)

# starting a fresh rep clears the logs; /debrief must preserve them
if mode == "interview":
    state = {"unlocks": [], "setting": setting}
elif mode == "drill":
    state = {"stalls": [], "setting": setting}
elif mode in ("tutor", "off"):
    state = {}

state["mode"] = mode
state["since"] = datetime.datetime.now().isoformat(timespec="seconds")

save(STATE, state)
print("mode: %s%s" % (mode, " (%s)" % setting if setting else ""))
