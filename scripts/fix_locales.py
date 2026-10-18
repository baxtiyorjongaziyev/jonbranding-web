import json
import os

locales_dir = r"c:\Users\baxti\.gemini\antigravity\playground\jonbranding-veb-sayti\src\locales"
files = ["uz.json", "ru.json", "en.json", "zh.json"]

# Premium King Kong Lite structure for all languages
content = {
    "uz.json": {
        "header": "Strategik sessiya",
        "description": "Biznesingizni keyingi bosqichga olib chiqish uchun ma'lumot qoldiring. Biz faqat o'sadigan bizneslar bilan ishlaymiz.",
        "successToast": { "title": "Rahmat!", "description": "Ma'lumotlar qabul qilindi. Tez orada bog'lanamiz." },
        "steps": {
            "step1": { "title": "Siz kimsiz?", "subtitle": "Biznesdagi rolingiz va darajangiz?" },
            "step2": { "title": "Maqsad va Muammo", "subtitle": "Sizni nima to'xtatib turibdi?" },
            "step3": { "title": "Investitsiya", "subtitle": "Loyiha uchun ajratilgan investitsiya miqdori?" },
            "step4": { "title": "Aloqa", "subtitle": "Yakuniy qadam: qanday bog'lanamiz?" }
        },
        "fields": {
            "role": { "label": "Sizning rolingiz?", "options": [{"v":"owner", "l":"Biznes egasi / CEO"}, {"v":"marketing", "l":"Marketolog"}, {"v":"starter", "l":"Startuper"}] },
            "revenue": { "label": "Oylik oborot ($)?", "options": ["$0 - $5,000", "$5,000 - $20,000", "$20,000+"] },
            "ambition": { "label": "1 yillik maqsadingiz?", "placeholder": "Bozor lideri bo'lish, eksport..." },
            "pain": { "label": "Asosiy to'siq?", "options": [{"v":"trust", "l":"Mijozlar ishonchi past"}, {"v":"design", "l":"Dizayn eskirgan"}, {"v":"sales", "l":"Sotuvlar o'smayapti"}] },
            "budget": { "label": "Investitsiya miqdori?", "placeholder": "Byudjetni tanlang" },
            "name": { "label": "Ismingiz", "placeholder": "Ali..." },
            "phone": { "label": "Telefon", "placeholder": "+998..." }
        },
        "buttons": { "next": "DAVOM ETISH", "back": "ORQAGA", "submit": "STRATEGIK SESSIYANI BAND QILISH" }
    },
    "ru.json": {
        "header": "Стратегическая сессия",
        "description": "Оставьте данные, чтобы вывести ваш бизнес на новый уровень. Мы работаем только с растущими бизнесами.",
        "successToast": { "title": "Спасибо!", "description": "Данные приняты. Мы свяжемся с вами в ближайшее время." },
        "steps": {
            "step1": { "title": "Кто вы?", "subtitle": "Ваша роль в бизнесе и уровень дохода?" },
            "step2": { "title": "Цель и проблема", "subtitle": "Что вас сдерживает?" },
            "step3": { "title": "Инвестиции", "subtitle": "Какую сумму вы готовы инвестировать в проект?" },
            "step4": { "title": "Контакты", "subtitle": "Последний шаг: как с вами связаться?" }
        },
        "fields": {
            "role": { "label": "Ваша роль?", "options": [{"v":"owner", "l":"Владелец / CEO"}, {"v":"marketing", "l":"Маркетолог"}, {"v":"starter", "l":"Стартапер"}] },
            "revenue": { "label": "Месячный оборот ($)?", "options": ["$0 - $5,000", "$5,000 - $20,000", "$20,000+"] },
            "ambition": { "label": "Цель на 1 год?", "placeholder": "Стать лидером рынка, экспорт..." },
            "pain": { "label": "Основное препятствие?", "options": [{"v":"trust", "l":"Низкое доверие клиентов"}, {"v":"design", "l":"Дизайн устарел"}, {"v":"sales", "l":"Продажи не растут"}] },
            "budget": { "label": "Сумма инвестиций?", "placeholder": "Выберите бюджет" },
            "name": { "label": "Ваше имя", "placeholder": "Али..." },
            "phone": { "label": "Телефон", "placeholder": "+998..." }
        },
        "buttons": { "next": "ПРОДОЛЖИТЬ", "back": "НАЗАД", "submit": "ЗАБРОНИРОВАТЬ СЕССИЮ" }
    },
    "en.json": {
        "header": "Strategic Session",
        "description": "Provide details to take your business to the next level. We only work with companies ready for growth.",
        "successToast": { "title": "Thank you!", "description": "Data received. We'll be in touch shortly." },
        "steps": {
            "step1": { "title": "Who are you?", "subtitle": "Business role and revenue tier?" },
            "step2": { "title": "Goals & Pain Points", "subtitle": "What is holding you back?" },
            "step3": { "title": "Investment", "subtitle": "Planned investment for the project?" },
            "step4": { "title": "Contact", "subtitle": "Final step: how to reach you?" }
        },
        "fields": {
            "role": { "label": "Your role?", "options": [{"v":"owner", "l":"Business Owner / CEO"}, {"v":"marketing", "l":"Marketer"}, {"v":"starter", "l":"Startuper"}] },
            "revenue": { "label": "Monthly Revenue ($)?", "options": ["$0 - $5,000", "$5,000 - $20,000", "$20,000+"] },
            "ambition": { "label": "1-year outcome?", "placeholder": "Market leader, export..." },
            "pain": { "label": "Main barrier?", "options": [{"v":"trust", "l":"Low customer trust"}, {"v":"design", "l":"Outdated design"}, {"v":"sales", "l":"Stagnant sales"}] },
            "budget": { "label": "Investment range?", "placeholder": "Select budget" },
            "name": { "label": "Full name", "placeholder": "John Doe..." },
            "phone": { "label": "Phone number", "placeholder": "+..." }
        },
        "buttons": { "next": "CONTINUE", "back": "BACK", "submit": "BOOK STRATEGIC SESSION" }
    },
    "zh.json": {
        "header": "战略咨询会议",
        "description": "提供详细信息，将您的业务提升到新的水平。我们只与准备好增长的公司合作。",
        "successToast": { "title": "谢谢！", "description": "数据已收到。我们将很快与您联系。" },
        "steps": {
            "step1": { "title": "你是谁？", "subtitle": "业务角色和收入层级？" },
            "step2": { "title": "目标与痛点", "subtitle": "是什么阻碍了您的发展？" },
            "step3": { "title": "投资", "subtitle": "为项目计划的投资？" },
            "step4": { "title": "联系方式", "subtitle": "最后一步：如何联系您？" }
        },
        "fields": {
            "role": { "label": "您的角色？", "options": [{"v":"owner", "l":"企业主 / CEO"}, {"v":"marketing", "l":"营销人员"}, {"v":"starter", "l":"创业者"}] },
            "revenue": { "label": "每月收入 ($)？", "options": ["$0 - $5,000", "$5,000 - $20,000", "$20,000+"] },
            "ambition": { "label": "1年后的成果？", "placeholder": "市场领导者，出口..." },
            "pain": { "label": "主要障碍？", "options": [{"v":"trust", "l":"客户信任度低"}, {"v":"design", "l":"设计陈旧"}, {"v":"sales", "l":"销售停滞不前"}] },
            "budget": { "label": "投资范围？", "placeholder": "选择预算" },
            "name": { "label": "全名", "placeholder": "姓名..." },
            "phone": { "label": "电话号码", "placeholder": "+..." }
        },
        "buttons": { "next": "继续", "back": "返回", "submit": "预订战略咨询" }
    }
}

for filename in files:
    path = os.path.join(locales_dir, filename)
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Remove any existing contactModal keys (including duplicates)
    if "contactModal" in data:
        del data["contactModal"]
    
    # Inject new one
    data["contactModal"] = content[filename]
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

print("Successfully updated all 4 locales (UZ, RU, EN, ZH) with King Kong Lite funnel.")
