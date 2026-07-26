from __future__ import annotations

from pathlib import Path
import json
import re
import sys

root = Path(sys.argv[1]).resolve()


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    return source.replace(old, new, 1)


route_path = root / "src/app/api/submit-form/route.ts"
route = route_path.read_text(encoding="utf-8")
route = replace_once(route, "import { createHash } from 'crypto';\n", "", "crypto import")
route = replace_once(
    route,
    "import { logger } from '@/lib/logger';\n",
    "import { logger } from '@/lib/logger';\nimport { runAnalyticsDeliveries } from '@/lib/analytics-delivery';\n",
    "analytics import",
)
route = replace_once(route, "const UZS_TO_USD_RATE = 1 / 12700;\n", "", "UZS constant")
route = replace_once(route, "const DEFAULT_GA_MEASUREMENT_ID = 'G-BTSGJQLMMV';\n", "", "GA constant")
route, count = re.subn(
    r"function sha256\(value: unknown\) \{.*?\n\}\n\n(?=function stripUndefined)",
    "",
    route,
    count=1,
    flags=re.S,
)
if count != 1:
    raise SystemExit(f"sha256 helper: expected 1 match, found {count}")
route, count = re.subn(
    r"async function sendMetaConversionEvent\(data: any\) \{.*?\n\}\n\n(?=function describeAmoCrmError)",
    "",
    route,
    count=1,
    flags=re.S,
)
if count != 1:
    raise SystemExit(f"legacy analytics functions: expected 1 match, found {count}")
route = replace_once(
    route,
    "        integrations: { telegram: true, amoCrm: true, amoCrmQueued: false, analytics: true },\n",
    "        integrations: {\n          telegram: true,\n          amoCrm: true,\n          amoCrmQueued: false,\n          analytics: false,\n          analyticsDelivery: null,\n        },\n",
    "guard response",
)
route = replace_once(
    route,
    "    sendMetaConversionEvent(leadData).catch(() => {});\n    sendGAConversionEvent(leadData).catch(() => {});\n    sendToN8n(leadData).catch(() => {});\n",
    "    const analyticsDelivery = await runAnalyticsDeliveries(leadData);\n    for (const [channel, delivery] of Object.entries(analyticsDelivery.channels)) {\n      if (delivery.state === 'failed') {\n        logger.error('Analytics delivery failed', {\n          channel,\n          eventId: leadData.eventId,\n          statusCode: delivery.statusCode,\n          reason: delivery.reason,\n          durationMs: delivery.durationMs,\n        });\n      }\n    }\n",
    "analytics calls",
)
route = replace_once(
    route,
    "        analytics: true,\n",
    "        analytics: analyticsDelivery.ok,\n        analyticsDelivery,\n",
    "analytics response",
)
route_path.write_text(route, encoding="utf-8")

next_path = root / "next.config.js"
next_config = next_path.read_text(encoding="utf-8")
next_config = replace_once(
    next_config,
    "  typescript: {\n    ignoreBuildErrors: true,\n  },\n",
    "",
    "ignoreBuildErrors block",
)
next_path.write_text(next_config, encoding="utf-8")

package_path = root / "package.json"
package = json.loads(package_path.read_text(encoding="utf-8"))
package["scripts"]["test:e2e"] = "playwright test --project=chromium"
package_path.write_text(json.dumps(package, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

playwright_path = root / "playwright.config.ts"
playwright = playwright_path.read_text(encoding="utf-8")
playwright = replace_once(
    playwright,
    "    // baseURL: 'http://localhost:3000',\n",
    "    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:9002',\n",
    "Playwright base URL",
)
playwright = replace_once(
    playwright,
    "  /* Run your local dev server before starting the tests */\n  // webServer: {\n  //   command: 'npm run start',\n  //   url: 'http://localhost:3000',\n  //   reuseExistingServer: !process.env.CI,\n  // },\n",
    "  webServer: {\n    command: 'npm run dev',\n    url: 'http://127.0.0.1:9002/en',\n    reuseExistingServer: !process.env.CI,\n    timeout: 180_000,\n  },\n",
    "Playwright web server",
)
playwright_path.write_text(playwright, encoding="utf-8")

example_path = root / "tests/example.spec.ts"
example = example_path.read_text(encoding="utf-8")
example = replace_once(
    example,
    "import { test, expect } from '@playwright/test';\n",
    "import { test, expect } from '@playwright/test';\n\nconst baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:9002';\n",
    "example base URL constant",
)
if example.count("page.goto('https://www.jonbranding.uz/uz')") != 2:
    raise SystemExit("example URLs: expected 2 matches")
example = example.replace("page.goto('https://www.jonbranding.uz/uz')", "page.goto(`${baseUrl}/uz`)")
example_path.write_text(example, encoding="utf-8")

workflow_path = root / ".github/workflows/test.yml"
workflow = workflow_path.read_text(encoding="utf-8")
if "\n  e2e:\n" in workflow:
    raise SystemExit("E2E job already exists")
workflow += """

  e2e:
    name: Playwright Chromium E2E
    needs: test
    runs-on: ubuntu-latest
    timeout-minutes: 25
    steps:
      - uses: actions/checkout@v7

      - name: Set up Node.js
        uses: actions/setup-node@v6
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Chromium
        run: npx playwright install --with-deps chromium

      - name: Run Playwright E2E
        run: npm run test:e2e
        env:
          PLAYWRIGHT_BASE_URL: http://127.0.0.1:9002
          NEXT_PUBLIC_SANITY_PROJECT_ID: h6ymmj0v
          NEXT_PUBLIC_SANITY_DATASET: production
          NEXT_PUBLIC_OISHA_API_URL: http://127.0.0.1:8080
          NEXT_TELEMETRY_DISABLED: '1'

      - name: Upload Playwright report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
"""
workflow_path.write_text(workflow, encoding="utf-8")
