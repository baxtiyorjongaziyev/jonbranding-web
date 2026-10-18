import json
import os

def load_keys(path):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return set(get_all_keys(data))

def get_all_keys(d, prefix=''):
    keys = []
    for k, v in d.items():
        full_key = f"{prefix}.{k}" if prefix else k
        keys.append(full_key)
        if isinstance(v, dict):
            keys.extend(get_all_keys(v, full_key))
    return keys

base_path = r'c:\Users\baxti\.gemini\antigravity\playground\jonbranding-veb-sayti\src\locales'
files = ['uz.json', 'ru.json', 'en.json', 'zh.json']

all_sets = {}
for f in files:
    path = os.path.join(base_path, f)
    all_sets[f] = load_keys(path)

# Compare with uz.json as base
base = all_sets['uz.json']
for f in ['ru.json', 'en.json', 'zh.json']:
    other = all_sets[f]
    missing = base - other
    extra = other - base
    print(f"--- {f} relative to uz.json ---")
    print(f"Missing keys: {len(missing)}")
    if missing:
        print(f"Examples: {list(missing)[:5]}")
    print(f"Extra keys: {len(extra)}")
    if extra:
        print(f"Examples: {list(extra)[:5]}")
