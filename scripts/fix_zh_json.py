import json
import os

def update_nested_dict(d, key, value):
    keys = key.split('.')
    for k in keys[:-1]:
        d = d.setdefault(k, {})
    d[keys[-1]] = value

# Translations for zh.json
translations = {
  "results.title": "客户成果",
  "results.subtitle": "我们不仅创造美观的设计，还创造有助于业务发展的战略解决方案。",
  "results.items": [
    {
      "title": "Den Aroma",
      "impact": "+60%",
      "desc": "平均订单金额增加",
      "label": "销售增长"
    },
    {
      "title": "Bexruz Market",
      "impact": "+40%",
      "desc": "客户流量增加",
      "label": "访问量"
    },
    {
      "title": "Zamin Qurilish",
      "impact": "3 倍",
      "desc": "品牌知名度提高",
      "label": "声誉"
    }
  ]
}

zh_path = r'c:\Users\baxti\.gemini\antigravity\playground\jonbranding-veb-sayti\src\locales\zh.json'

with open(zh_path, 'r', encoding='utf-8') as f:
    zh_data = json.load(f)

for k, v in translations.items():
    update_nested_dict(zh_data, k, v)

with open(zh_path, 'w', encoding='utf-8') as f:
    json.dump(zh_data, f, ensure_ascii=False, indent=2)

print("zh.json updated successfully with 4 missing translations.")
