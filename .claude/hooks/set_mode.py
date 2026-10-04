#!/usr/bin/env python3
"""Set the active practice mode, or the candidate's target level.

Usage: set_mode.py interview|practice|debrief|off
       set_mode.py level <level>   (e.g. senior, staff; saved to prep-settings.json)
"""
import json, os, sys, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATE = os.path.join(ROOT, ".interview-state")
SETTINGS = os.path.join(ROOT, "prep-settings.json")
VALID = ("interview", "practice", "debrief", "off")


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

if mode not in VALID:
    sys.exit("mode must be one of: %s, or: level <level>" % ", ".join(VALID))

if mode in ("interview", "practice") and not load(SETTINGS).get("level"):
    sys.exit("no level set. Run /prep-plan, or: set_mode.py level <level>")

state = load(STATE)

# starting a fresh rep clears the unlock log; /debrief must preserve it
if mode in ("interview", "practice"):
    state = {"unlocks": []}
elif mode == "off":
    state = {}

state["mode"] = mode
state["since"] = datetime.datetime.now().isoformat(timespec="seconds")

save(STATE, state)
print("mode: %s" % mode)
