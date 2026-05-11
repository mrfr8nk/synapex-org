// Shared professional email template builder for Synapex.
// Single source of truth — used by send-magic-link and newsletter functions.

export const BRAND = {
  name: "Synapex",
  tagline: "Synapex Developers",
  site: "https://synapex.co.zw",
  supportEmail: "hello@synapex.co.zw",
  address: "Synapex Technologies · Harare, Zimbabwe",
};

export interface ShellOptions {
  preheader?: string;          // hidden preview text
  unsubscribeUrl?: string;     // optional unsubscribe footer link
  showSocial?: boolean;
}

/** Wraps body HTML in a polished, dark, mobile-first email shell. */
export function renderEmail(bodyHtml: string, opts: ShellOptions = {}): string {
  const year = new Date().getFullYear();
  const preheader = (opts.preheader || "").replace(/[<>]/g, "");
  const unsub = opts.unsubscribeUrl
    ? `<a href="${opts.unsubscribeUrl}" style="color:#7a7a85;text-decoration:underline;">Unsubscribe</a> &nbsp;·&nbsp; `
    : "";

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="x-apple-disable-message-reformatting"/>
<meta name="color-scheme" content="dark"/>
<meta name="supported-color-schemes" content="dark"/>
<title>${BRAND.name}</title>
<!--[if mso]><style>body,table,td,p,a{font-family:Helvetica,Arial,sans-serif !important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#070708;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#070708;">
<tr><td align="center" style="padding:48px 16px;">

  <!-- Header / Wordmark -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;margin-bottom:14px;">
    <tr>
      <td align="left" style="padding:0 4px;">
        <a href="${BRAND.site}" style="text-decoration:none;color:#fff;font-size:13px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;">${BRAND.name.toUpperCase()}</a>
      </td>
      <td align="right" style="padding:0 4px;">
        <span style="color:#5a5a64;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;">${BRAND.tagline}</span>
      </td>
    </tr>
  </table>

  <!-- Card -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#0e0e10;border:1px solid rgba(255,255,255,0.06);border-radius:18px;overflow:hidden;">
    <tr><td style="height:3px;background:linear-gradient(90deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%);"></td></tr>
    <tr><td style="padding:44px 44px 36px;color:#e8e8ec;">
${bodyHtml}
    </td></tr>
  </table>

  <!-- Footer -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;margin-top:20px;">
    <tr><td align="center" style="padding:8px 16px;">
      <p style="margin:0 0 6px;font-size:11px;color:#6b6b73;line-height:1.7;">
        ${unsub}<a href="${BRAND.site}" style="color:#7a7a85;text-decoration:underline;">synapex.co.zw</a> &nbsp;·&nbsp; <a href="mailto:${BRAND.supportEmail}" style="color:#7a7a85;text-decoration:underline;">${BRAND.supportEmail}</a>
      </p>
      <p style="margin:0;font-size:11px;color:#48484f;line-height:1.7;">
        © ${year} ${BRAND.address}
      </p>
    </td></tr>
  </table>

</td></tr></table></body></html>`;
}

/** Primary pill button. */
export function button(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px;"><tr>
<td style="background:#ffffff;border-radius:999px;">
<a href="${href}" style="display:inline-block;padding:14px 30px;background:#ffffff;color:#0a0a0a;font-size:14px;font-weight:600;text-decoration:none;border-radius:999px;letter-spacing:-0.01em;">${label}</a>
</td></tr></table>`;
}

/** Subtle informational chip row (2 columns). */
export function infoChips(left: { label: string; value: string }, right: { label: string; value: string }): string {
  const cell = (c: { label: string; value: string }) =>
    `<td style="background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px 16px;">
      <p style="margin:0 0 4px;font-size:10px;color:#6b6b73;letter-spacing:0.14em;text-transform:uppercase;font-weight:500;">${c.label}</p>
      <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;">${c.value}</p>
    </td>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px;">
<tr>
  <td style="width:50%;padding-right:6px;vertical-align:top;"><table width="100%"><tr>${cell(left)}</tr></table></td>
  <td style="width:50%;padding-left:6px;vertical-align:top;"><table width="100%"><tr>${cell(right)}</tr></table></td>
</tr></table>`;
}
