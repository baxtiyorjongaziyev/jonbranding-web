import json
import os

def get_all_kv(d, prefix=''):
    kv = {}
    for k, v in d.items():
        full_key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            kv.update(get_all_kv(v, full_key))
        else:
            kv[full_key] = v
    return kv

base_path = r'c:\Users\baxti\.gemini\antigravity\playground\jonbranding-veb-sayti\src\locales'
uz_path = os.path.join(base_path, 'uz.json')
en_path = os.path.join(base_path, 'en.json')

with open(uz_path, 'r', encoding='utf-8') as f:
    uz_data = json.load(f)
with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

uz_kv = get_all_kv(uz_data)
en_kv = get_all_kv(en_data)

missing_keys = set(uz_kv.keys()) - set(en_kv.keys())
missing_data = {k: uz_kv[k] for k in sorted(missing_keys)}

with open('missing_en_translations.json', 'w', encoding='utf-8') as f:
    json.dump(missing_data, f, ensure_ascii=False, indent=2)

print(f"Extraction complete. Found {len(missing_data)} missing translation keys in en.json.")
