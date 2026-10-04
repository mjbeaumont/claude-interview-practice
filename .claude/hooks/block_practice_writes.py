#!/usr/bin/env python3
"""PreToolUse hook: refuse to let Claude write code into practice files.

The one rule that does not depend on Claude's compliance.
"""
import json, os, sys, fnmatch

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATE = os.path.join(ROOT, ".interview-state")
GUARDED = ["*.practice.ts", "*.practice.js", "*.practice.py"]


def deny(reason):
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason,
    }}))
    sys.exit(0)


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return

    if payload.get("tool_name") not in ("Edit", "Write", "NotebookEdit"):
        return

    try:
        with open(STATE) as f:
            mode = json.load(f).get("mode", "off")
    except Exception:
        return

    if mode not in ("interview", "practice"):
        return

    path = payload.get("tool_input", {}).get("file_path", "") or ""
    name = os.path.basename(path)
    if any(fnmatch.fnmatch(name, pat) for pat in GUARDED):
        deny("Blocked: %s mode is active. The candidate writes the practice file, not you. "
             "You may read it and run it, but not edit it." % mode)


main()
