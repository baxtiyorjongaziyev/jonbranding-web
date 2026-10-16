# ECC for Codex CLI

This supplements the root `AGENTS.md` with a repo-local ECC baseline.

## Repo Skills & Design System (Mandatory)

- Repo-generated Codex skill: `.agents/skills/jonbranding-web/SKILL.md`
- Claude-facing companion skill: `.claude/skills/jonbranding-web/SKILL.md`
- **Master Design & Anti-AI-Slop Skills (`.agents/skills/`):**
  - When working on any UI/UX or frontend code, Codex must adhere to:
    - `design-taste-frontend`, `ui-craft`, `ui-craft-editorial` (luxury Central Asian brand agency aesthetic)
    - `colorize` (60% `#FFFFFF`, 30% `#0A0B0E`, 10% `#2554FF`)
    - `ui-animation` & `gsap-scrolltrigger` (smooth spring physics, no layout-shifting `transition: all`)
    - `impeccable`: run `node .agents/skills/impeccable/scripts/detect.mjs` — zero anti-patterns permitted
    - `finalize` & harness: run `npm run verify:fast` before concluding
- Keep user-specific credentials and private MCPs in `~/.codex/config.toml`, not in this repo.

## MCP Baseline

Treat `.codex/config.toml` as the default ECC-safe baseline for work in this repository.
The generated baseline enables GitHub, Context7, Exa, Memory, Playwright, and Sequential Thinking.

## Multi-Agent Support

- Explorer: read-only evidence gathering
- Reviewer: correctness, security, and regression review
- Docs researcher: API and release-note verification

## Workflow Files

- No dedicated workflow command files were generated for this repo.

Use these workflow files as reusable task scaffolds when the detected repository workflows recur.

## Telegram & AI Tandem Sync

- When Codex reads Telegram messages or dialogs via Telegram MCP, write or append the results to `obsidian-vault/Telegram_Inbox.md`.
- Antigravity will process `Telegram_Inbox.md` to update Master Context, sales leads, or task backlogs.