"""Write version.json ({git_sha, built_at}) for the index page's build footer.

Run from anywhere before serving: python scripts/write_version.py
version.json is generated and git-ignored; the footer stays empty without it.
"""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# `rev-parse` and `log -1` read local refs and answer in milliseconds; 30 s means git itself is stuck.
GIT_TIMEOUT_S = 30


def _git(*args: str) -> str:
    try:
        return subprocess.run(
            ["git", *args], cwd=ROOT, check=True, capture_output=True, text=True, timeout=GIT_TIMEOUT_S
        ).stdout.strip()
    except subprocess.TimeoutExpired:
        raise SystemExit(f"❌ git {args[0]} did not finish within {GIT_TIMEOUT_S}s; version.json not written") from None


def main() -> None:
    body = {"git_sha": _git("rev-parse", "--short", "HEAD"), "built_at": _git("log", "-1", "--format=%cI")}
    (ROOT / "version.json").write_text(json.dumps(body) + "\n", encoding="utf-8")
    print(f"✅ version.json: {body['git_sha']} {body['built_at']}")


if __name__ == "__main__":
    main()
