# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Branch model

The repo has two intentionally-diverged branches that should **never be merged**:

- **`main`** (this branch) — what GitHub Pages serves at `yengandadam.com`. Public site only, plus deployed assets the email tool needs.
- **`feat/email-sender`** — local-only admin tool for sending save-the-date emails (`admin/`). Never merged into `main`.

You're currently on `main`. Edit website code here. Don't add the `admin/` tool or any local-only scripts to this branch.

## Skill requirement

Always invoke the `frontend-design` skill before making any UI or frontend changes in this project.

## Running the site

No build system. Serve the repo root with any static file server, then visit `/savethedate/`:

```
npx serve .
# or
python -m http.server
```

## Site layout

- `/` (root `index.html`) — placeholder page served at `yengandadam.com/`.
- `/savethedate/` — the actual save-the-date site (single `index.html` with inline CSS/JS, plus its own `assets/`).
- `CNAME` — GitHub Pages custom domain (`yengandadam.com`); must stay at repo root.

## Architecture

`savethedate/index.html` — all CSS and JS are inline. Three full-viewport scroll sections:

1. **Greeting** — personalised "To: [Name]" fade-in. Guest name is fetched from Google Sheets using a `?id=` URL query param and the Sheets REST API.
2. **Hero card** — the save-the-date card (Yeng & Adam, May 1 2027, Chicago). An SVG embossed border frame is injected programmatically by the first `<script>` block (not in the HTML).
3. **RSVP** — mailing address form that POSTs to a Google Apps Script URL via `fetch` with `mode: "no-cors"`.

### Design tokens

CSS custom properties in `:root`: `--green`, `--green-mid`, `--green-light`, `--card-bg`. Typography uses `cqi` (container query inline-size) units so text scales with the card width. Fonts: Cormorant Garamond (serif) + Lato (sans-serif) from Google Fonts.

### Card sizing & layout

Cards are sized with `width: min(100%, calc(90vh * 15 / 21))` and `aspect-ratio: 15/21` (portrait A4-ish). Padding lives in `.hero-inner` / `.rsvp-inner` (not on `.letter-card`) so that `cqi` resolves against the full card width.

### Scroll animations

Card visibility is managed by `IntersectionObserver` (`threshold: 0.3`). A separate scroll listener tracks direction; cards re-hide on upward scroll after they've been seen once.

### External integrations

- **Guest lookup**: Google Sheets API (`SHEET_ID`, `API_KEY` hardcoded in JS) — reads column A (ID) and B (name) from Sheet1.
- **RSVP submission**: Google Apps Script (`SCRIPT_URL` hardcoded in JS) — receives `{ partyName, mailingAddress }` JSON.

### Assets

- `savethedate/assets/background.jpg` — background image (all screen sizes)
- `savethedate/assets/letter.jpg` — parchment texture used as the card background
- `savethedate/assets/couple.jpg` — *not used by the website*. Lives here only because the email template on `feat/email-sender` loads it from `https://yengandadam.com/savethedate/assets/couple.jpg`. If you replace the photo, do it on `main`.
