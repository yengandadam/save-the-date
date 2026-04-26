# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Branch model

The repo has two intentionally-diverged branches that should **never be merged**:

- **`main`** — what GitHub Pages serves at `yengandadam.com`. Public site only, plus deployed assets the email tool needs.
- **`feat/email-sender`** (this branch) — local-only admin tool for sending save-the-date emails (`admin/`). Never pushed-and-merged into `main`.

You're currently on `feat/email-sender`. Edit `admin/` here. Do not edit website code on this branch — make website changes on `main`.

## Skill requirement

Always invoke the `frontend-design` skill before making any UI or frontend changes in this project.

## Admin tool (`admin/`)

Local Express server using [Resend](https://resend.com) to send the save-the-date emails. Full setup in [admin/README.md](admin/README.md).

- `admin/server.js` — Express server (`/api/status`, `/api/preview`, `/api/send`)
- `admin/email-template.js` — HTML + plain-text email builder. `SITE_BASE` points at the deployed site (`https://yengandadam.com/savethedate`).
- `admin/public/index.html` — admin UI
- `admin/.env` — secrets (gitignored)

Run with `npm start` from `admin/`, then open `http://localhost:3000`.

### The `couple.jpg` carve-out

The email template loads the hero photo via `<img src="${SITE_BASE}/assets/couple.jpg">`, so the file has to be reachable at a public URL. It lives on `main` at `savethedate/assets/couple.jpg` — *deployed even though the website doesn't render it* — for the email's sake. If you replace the photo, push the new file to `main`, not here.
