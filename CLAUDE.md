# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Skill requirement

Always invoke the `frontend-design` skill before making any UI or frontend changes in this project.

## Running the site

No build system. Open `index.html` directly in a browser, or serve it with any static file server:

```
npx serve .
# or
python -m http.server
```

## Architecture

Single `index.html` — all CSS and JS are inline. Three full-viewport scroll sections:

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

- `assets/background.jpg` — background image (all screen sizes)
- `assets/letter.jpg` — parchment texture used as the card background
