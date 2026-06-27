from playwright.sync_api import sync_playwright
import sys
sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    failed_requests = []
    page.on("requestfailed", lambda req: failed_requests.append(f"{req.method} {req.url} -> {req.failure}"))
    
    console_msgs = []
    page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text}"))
    page.on("pageerror", lambda err: console_msgs.append(f"[PAGEERROR] {err}"))
    
    page.goto('https://jonbranding.uz/uz', timeout=30000)
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(3000)
    
    # Check for the specific component
    result = page.evaluate("""() => {
        const atelierEl = document.querySelector('.atelier-theme');
        const galEl = document.querySelector('.gal');
        const galGrid = document.querySelector('.gal-grid');
        const sanityImgs = document.querySelectorAll('img[src*="cdn.sanity.io"]');
        
        // Get all section IDs and classes
        const sections = [];
        document.querySelectorAll('section').forEach(s => {
            sections.push(s.id + ' | ' + s.className.substring(0, 60));
        });
        
        return {
            hasAtelierTheme: !!atelierEl,
            hasGal: !!galEl,
            hasGalGrid: !!galGrid,
            sanityImgCount: sanityImgs.length,
            sections: sections,
        };
    }""")
    
    print(f"atelier-theme: {result['hasAtelierTheme']}")
    print(f".gal: {result['hasGal']}")
    print(f".gal-grid: {result['hasGalGrid']}")
    print(f"Sanity imgs: {result['sanityImgCount']}")
    print(f"\nSections ({len(result['sections'])}):")
    for s in result['sections']:
        print(f"  {s}")
    
    if failed_requests:
        print("\nFailed requests:")
        for r in failed_requests[:10]:
            print(f"  {r}")
    
    # Filter for page errors
    page_errors = [m for m in console_msgs if m.startswith('[PAGEERROR]')]
    error_msgs = [m for m in console_msgs if m.startswith('[error]')]
    if page_errors:
        print("\nPage errors:")
        for e in page_errors:
            print(f"  {e[:300]}")
    if error_msgs:
        print("\nConsole errors:")
        for e in error_msgs:
            print(f"  {e[:300]}")
    
    browser.close()
