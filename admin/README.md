# Save-the-Date Dispatch

Local-only admin tool to send save-the-date emails through [Resend](https://resend.com).

## Setup

1. Install dependencies (from this folder):

   ```
   npm install
   ```

2. Create your env file:

   ```
   cp .env.example .env
   ```

   Fill in `RESEND_API_KEY`. For sending, you'll either:
   - Use `onboarding@resend.dev` as `FROM_EMAIL` (works without domain verification, but only sends to your own verified address — fine for testing)
   - Or verify a domain in the Resend dashboard and use `Yeng & Adam <savethedate@yourdomain.com>`

3. Make sure the hero photo lives at `../savethedate/assets/couple.jpg` and is committed + pushed to GitHub Pages, since the email template loads it from `https://yengandadam.com/savethedate/assets/couple.jpg`.

4. Start the server:

   ```
   npm start
   ```

   Open <http://localhost:3000>.

## Using the dispatch tool

- Paste recipients into the ledger, one per line: `id, email, name` (name is optional).
- Click **Dry run** to validate without sending.
- Tick the confirm checkbox, then **Send dispatch**.
- Preview the rendered email at any time: <http://localhost:3000/api/preview?id=preview&name=Friend>.

## Files

- `server.js` — Express server, `/api/status`, `/api/preview`, `/api/send`
- `email-template.js` — HTML + plain-text email builder
- `public/index.html` — admin UI
- `.env` — secrets (gitignored)
