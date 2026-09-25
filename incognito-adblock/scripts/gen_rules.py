"""Combina lists/*.txt en rules.json (formato declarativeNetRequest de Chrome)."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
LISTS_DIR = ROOT / "lists"
OUT_PATH = ROOT / "rules.json"


def load_domains() -> list[str]:
    domains: list[str] = []
    seen: set[str] = set()
    for txt_file in sorted(LISTS_DIR.glob("*.txt")):
        for line in txt_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if line not in seen:
                seen.add(line)
                domains.append(line)
    return domains


def build_rule(rule_id: int, entry: str) -> dict:
    has_path = "/" in entry
    url_filter = f"||{entry}" if has_path else f"||{entry}^"
    return {
        "id": rule_id,
        "priority": 1,
        "action": {"type": "block"},
        "condition": {"urlFilter": url_filter},
    }


def main() -> None:
    domains = load_domains()
    rules = [build_rule(i + 1, domain) for i, domain in enumerate(domains)]
    OUT_PATH.write_text(json.dumps(rules, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(rules)} reglas escritas en {OUT_PATH}")


if __name__ == "__main__":
    main()
