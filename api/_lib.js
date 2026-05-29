'use strict';

// Configurazione invio. MAIL_FROM/LOGO_URL sovrascrivibili via env su Vercel.
const MAIL_FROM = process.env.MAIL_FROM || 'No reply Eurisko <no-reply@euriskosrl.it>';
const BCC = 'luca.porfido@euriskosrl.it';
const LOGO_URL = process.env.LOGO_URL || 'https://euriskosrl.it/logo-eurisko-color.png';

function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Prende il primo valore non vuoto tra piu' possibili nomi di campo (IT/EN).
function pick(obj, ...keys) {
  for (const k of keys) {
    const v = obj && obj[k];
    if (v != null && String(v).trim() !== '') return String(v).trim();
  }
  return '';
}

function row(label, value) {
  if (value == null || String(value).trim() === '') return '';
  return '<tr>'
    + '<td style="padding:8px 12px 8px 0;vertical-align:top;font-weight:bold;color:#475569;width:38%;">' + esc(label) + '</td>'
    + '<td style="padding:8px 0;vertical-align:top;white-space:pre-wrap;color:#0A1628;">' + esc(value) + '</td>'
    + '</tr>';
}

function emailShell(title, innerHtml, footerNote) {
  return '<!DOCTYPE html><html><head><meta charset="utf-8"></head>'
    + '<body style="margin:0;background:#f4f6f9;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#0A1628;">'
    + '<div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">'
    + '<div style="padding:24px;border-bottom:1px solid #e2e8f0;text-align:center;">'
    + '<img src="' + LOGO_URL + '" alt="Eurisko" width="180" style="max-width:180px;height:auto;display:inline-block;">'
    + '</div>'
    + '<div style="padding:24px;">'
    + '<h1 style="font-size:18px;margin:0 0 16px;color:#0A1628;">' + esc(title) + '</h1>'
    + innerHtml
    + '</div>'
    + '<div style="padding:16px 24px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">' + (footerNote || '') + '</div>'
    + '</div></body></html>';
}

async function sendEmail(payload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY mancante');
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    let detail = '';
    try { detail = await resp.text(); } catch (e) { /* noop */ }
    throw new Error('Resend ' + resp.status + ' ' + detail);
  }
  try { return await resp.json(); } catch (e) { return {}; }
}

// Verifica reCAPTCHA lato server SOLO se e' impostato RECAPTCHA_SECRET.
// Senza secret restituisce true (resta attivo il reCAPTCHA lato client + honeypot).
async function verifyRecaptcha(token, ip) {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret: secret, response: token });
    if (ip) body.set('remoteip', ip);
    const r = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const j = await r.json();
    return !!j.success;
  } catch (e) {
    return false;
  }
}

function redirect(res, location) {
  res.statusCode = 303;
  res.setHeader('Location', location);
  res.end();
}

function htmlResponse(res, status, html) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
}

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
}

module.exports = {
  esc, pick, row, emailShell, sendEmail, verifyRecaptcha,
  redirect, htmlResponse, clientIp, MAIL_FROM, BCC,
};
