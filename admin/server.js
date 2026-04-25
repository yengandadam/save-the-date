import 'dotenv/config';
import express from 'express';
import { Resend } from 'resend';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildEmail, buildSubject } from './email-template.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT || 3000);
const FROM_EMAIL = process.env.FROM_EMAIL || 'Yeng & Adam <onboarding@resend.dev>';
const REPLY_TO = process.env.REPLY_TO || undefined;
const API_KEY = process.env.RESEND_API_KEY;

if (!API_KEY) {
  console.warn(
    '\n[warn] RESEND_API_KEY is not set. Copy .env.example to .env and fill it in.\n' +
      '       The server will start, but /api/send will return an error.\n'
  );
}

const resend = API_KEY ? new Resend(API_KEY) : null;
const app = express();

app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Quick env check for the UI to know whether sending is wired up.
app.get('/api/status', (_req, res) => {
  res.json({
    ready: Boolean(resend),
    fromEmail: FROM_EMAIL,
    replyTo: REPLY_TO || null,
  });
});

// Preview the rendered email without sending it.
app.get('/api/preview', (req, res) => {
  const id = String(req.query.id || 'preview');
  const name = req.query.name ? String(req.query.name) : undefined;
  const { html } = buildEmail({ id, name });
  res.set('Content-Type', 'text/html; charset=utf-8').send(html);
});

// Send to a list of recipients. Sends sequentially with a small delay so we
// stay well under Resend's default rate limit and so per-recipient errors
// don't poison the batch.
app.post('/api/send', async (req, res) => {
  if (!resend) {
    return res.status(500).json({
      ok: false,
      error: 'RESEND_API_KEY not configured. See admin/.env.example.',
    });
  }

  const recipients = Array.isArray(req.body?.recipients) ? req.body.recipients : null;
  if (!recipients || recipients.length === 0) {
    return res.status(400).json({ ok: false, error: 'No recipients provided.' });
  }

  const dryRun = Boolean(req.body?.dryRun);
  const results = [];

  for (const r of recipients) {
    const id = String(r?.id || '').trim();
    const email = String(r?.email || '').trim();
    const name = r?.name ? String(r.name).trim() : undefined;

    if (!id || !email) {
      results.push({ id, email, ok: false, error: 'Missing id or email.' });
      continue;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      results.push({ id, email, ok: false, error: 'Invalid email format.' });
      continue;
    }

    if (dryRun) {
      results.push({ id, email, ok: true, dryRun: true });
      continue;
    }

    try {
      const { html, text } = buildEmail({ id, name });
      const subject = buildSubject({ name });

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject,
        html,
        text,
        replyTo: REPLY_TO,
        tags: [{ name: 'campaign', value: 'save-the-date' }, { name: 'guest_id', value: id }],
      });

      if (error) {
        results.push({ id, email, ok: false, error: error.message || String(error) });
      } else {
        results.push({ id, email, ok: true, messageId: data?.id });
      }
    } catch (err) {
      results.push({ id, email, ok: false, error: err?.message || String(err) });
    }

    // gentle pacing — ~2 emails/sec, well under Resend's 10/sec default
    await new Promise((r) => setTimeout(r, 500));
  }

  const sent = results.filter((r) => r.ok).length;
  res.json({ ok: true, sent, total: results.length, results });
});

app.listen(PORT, () => {
  console.log(`\n  Save-the-date dispatch running at http://localhost:${PORT}\n`);
});
