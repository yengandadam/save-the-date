// Builds the save-the-date email HTML.
//
// Designed for broad email-client compatibility:
//   - tables for outer layout (Outlook desktop)
//   - inline-friendly CSS in <style>, plus inline `style=""` on critical elements
//   - graceful fallbacks for Outlook (Georgia → Cormorant Garamond when available)
//   - hero photo loaded from the public GitHub Pages assets path

const SITE_BASE = 'https://yengandadam.github.io/save-the-date';
const HERO_IMAGE = `${SITE_BASE}/assets/couple.jpg`;

// May 1, 2027 — all-day event placeholder. Update times here when finalized.
// Google Calendar TEMPLATE format. For an all-day event, use YYYYMMDD/YYYYMMDD
// where the end is the day AFTER the event (exclusive).
const CALENDAR_URL = (() => {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Yeng & Adam — Wedding',
    dates: '20270501/20270502',
    details:
      "Save the date for Yeng & Adam's wedding in Chicago. " +
      'Formal invitation to follow.\n\n' +
      'Personal page: ' + SITE_BASE + '/?id=__ID__',
    location: 'Chicago, IL',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
})();

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildSubject({ name } = {}) {
  return name
    ? `Save the date — ${name}, you're invited`
    : 'Save the date — Yeng & Adam, May 1, 2027';
}

export function buildEmail({ id, name } = {}) {
  if (!id) throw new Error('buildEmail requires { id }');

  const safeId = encodeURIComponent(id);
  const personalUrl = `${SITE_BASE}/?id=${safeId}`;
  const calendarUrl = CALENDAR_URL.replace('__ID__', safeId);

  const greeting = name
    ? `<p class="greeting" style="margin:0 0 18px;font-family:Georgia,'Cormorant Garamond',serif;font-style:italic;font-size:20px;color:#3a4a35;">Dear ${escapeHtml(name)},</p>`
    : '';

  const text = buildPlainText({ id, name });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>Save the Date — Yeng &amp; Adam</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Lato:wght@300;400&display=swap" rel="stylesheet" />
<style>
  body { margin:0; padding:0; background:#efe9dd; -webkit-font-smoothing:antialiased; }
  table { border-collapse:collapse; }
  img { border:0; outline:none; text-decoration:none; display:block; }
  a { text-decoration:none; }

  .frame { width:100%; background:#efe9dd; padding:32px 16px; }
  .card  { width:100%; max-width:560px; margin:0 auto; background:#f7f1e3; border-radius:2px; box-shadow:0 24px 60px -30px rgba(40,55,35,0.35); overflow:hidden; }

  .hero  { width:100%; height:auto; display:block; }
  .body-pad { padding:40px 40px 32px; font-family:'Lato', Helvetica, Arial, sans-serif; color:#2c3a26; }

  .eyebrow {
    font-family:'Lato', Helvetica, Arial, sans-serif;
    font-size:11px; letter-spacing:0.32em; text-transform:uppercase;
    color:#7a8a6e; margin:0 0 18px;
  }

  .display {
    font-family:'Cormorant Garamond', Georgia, 'Times New Roman', serif;
    font-style:italic; font-weight:500;
    font-size:46px; line-height:1.05;
    color:#1a4a2e; margin:0 0 6px;
    letter-spacing:0.005em;
  }

  .rule { width:36px; height:1px; background:#7a8a6e; margin:18px 0; border:0; }

  .date {
    font-family:'Lato', Helvetica, Arial, sans-serif;
    font-size:13px; letter-spacing:0.4em; text-transform:uppercase;
    color:#3a4a35; margin:0 0 4px;
  }

  .place {
    font-family:'Cormorant Garamond', Georgia, serif;
    font-style:italic; font-size:18px; color:#3a4a35; margin:0 0 28px;
  }

  .body-copy {
    font-family:'Lato', Helvetica, Arial, sans-serif;
    font-size:15px; line-height:1.7; color:#3a4a35; margin:0 0 28px;
  }

  .btn-row { padding-top:6px; }
  .btn {
    display:inline-block;
    font-family:'Lato', Helvetica, Arial, sans-serif;
    font-size:12px; letter-spacing:0.28em; text-transform:uppercase;
    padding:14px 22px; border-radius:1px;
    text-decoration:none;
  }
  .btn-primary   { background:#1a4a2e; color:#f7f1e3 !important; }
  .btn-secondary { background:transparent; color:#1a4a2e !important; border:1px solid #1a4a2e; }

  .footer {
    font-family:'Lato', Helvetica, Arial, sans-serif;
    font-size:11px; letter-spacing:0.18em; text-transform:uppercase;
    color:#8a9382; text-align:center; padding:22px 16px 4px;
  }
  .footer a { color:#7a8a6e !important; }

  @media (max-width:520px) {
    .body-pad { padding:28px 24px 24px !important; }
    .display { font-size:38px !important; }
    .btn { display:block !important; text-align:center; margin-bottom:10px; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#efe9dd;">
  <span style="display:none !important;visibility:hidden;mso-hide:all;font-size:1px;color:#efe9dd;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Save the date — Yeng &amp; Adam, May 1, 2027 in Chicago.
  </span>

  <table role="presentation" class="frame" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#efe9dd;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" class="card" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background:#f7f1e3;">
          <tr>
            <td>
              <img src="${HERO_IMAGE}" alt="Yeng and Adam" class="hero" width="560" style="width:100%;height:auto;display:block;" />
            </td>
          </tr>
          <tr>
            <td class="body-pad" style="padding:40px 40px 32px;font-family:'Lato',Helvetica,Arial,sans-serif;color:#2c3a26;">
              <p class="eyebrow" style="margin:0 0 18px;font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:#7a8a6e;">Save the Date</p>
              ${greeting}
              <h1 class="display" style="margin:0 0 6px;font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-weight:500;font-size:46px;line-height:1.05;color:#1a4a2e;">
                Yeng &amp; Adam
              </h1>
              <hr class="rule" style="width:36px;height:1px;background:#7a8a6e;margin:18px 0;border:0;" />
              <p class="date" style="margin:0 0 4px;font-size:13px;letter-spacing:0.4em;text-transform:uppercase;color:#3a4a35;">May 1, 2027</p>
              <p class="place" style="margin:0 0 28px;font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:18px;color:#3a4a35;">Chicago, Illinois</p>

              <p class="body-copy" style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#3a4a35;">
                We can&rsquo;t wait to celebrate with you. A formal invitation will follow,
                but please mark the date and keep an eye out for details to come.
              </p>

              <table role="presentation" class="btn-row" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 10px 10px 0;">
                    <a href="${personalUrl}" class="btn btn-primary" style="display:inline-block;background:#1a4a2e;color:#f7f1e3;font-family:'Lato',Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.28em;text-transform:uppercase;padding:14px 22px;border-radius:1px;text-decoration:none;">
                      View Save the Date
                    </a>
                  </td>
                  <td style="padding:0 0 10px 0;">
                    <a href="${calendarUrl}" class="btn btn-secondary" style="display:inline-block;background:transparent;color:#1a4a2e;border:1px solid #1a4a2e;font-family:'Lato',Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.28em;text-transform:uppercase;padding:14px 22px;border-radius:1px;text-decoration:none;">
                      Add to Google Calendar
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="footer" style="font-family:'Lato',Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8a9382;text-align:center;padding:22px 16px 28px;">
              With love &middot; <a href="${personalUrl}" style="color:#7a8a6e;">yengandadam.github.io</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { html, text };
}

function buildPlainText({ id, name }) {
  const safeId = encodeURIComponent(id);
  const personalUrl = `${SITE_BASE}/?id=${safeId}`;
  const calendarUrl = CALENDAR_URL.replace('__ID__', safeId);
  const greeting = name ? `Dear ${name},\n\n` : '';
  return (
    greeting +
    `Save the date.\n\n` +
    `Yeng & Adam\n` +
    `May 1, 2027 — Chicago, Illinois\n\n` +
    `We can't wait to celebrate with you. A formal invitation will follow,\n` +
    `but please mark the date and keep an eye out for details to come.\n\n` +
    `View your save-the-date: ${personalUrl}\n` +
    `Add to Google Calendar:   ${calendarUrl}\n\n` +
    `With love,\n` +
    `Yeng & Adam\n`
  );
}
