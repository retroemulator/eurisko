'use strict';

const lib = require('./_lib.js');

async function readRaw(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks).toString('utf8');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { lib.htmlResponse(res, 405, 'Method Not Allowed'); return; }

  // Body robusto: usa req.body se gia' parsato, altrimenti leggi lo stream grezzo.
  let b = (req.body && typeof req.body === 'object') ? req.body : null;
  if (!b || Object.keys(b).length === 0) {
    let raw = typeof req.body === 'string' ? req.body : '';
    if (!raw) { try { raw = await readRaw(req); } catch (e) { raw = ''; } }
    b = Object.fromEntries(new URLSearchParams(raw));
  }

  const lang = lib.pick(b, 'lang') === 'en' ? 'en' : 'it';
  const thankYou = lang === 'en' ? '/en/thank-you' : '/grazie';

  if (lib.pick(b, '_honey')) { lib.redirect(res, thankYou); return; }

  const nome = lib.pick(b, 'nome', 'name');
  const email = lib.pick(b, 'email');
  const telefono = lib.pick(b, 'telefono', 'phone');
  const azienda = lib.pick(b, 'azienda', 'company');
  const ruolo = lib.pick(b, 'ruolo', 'role');
  const messaggio = lib.pick(b, 'messaggio', 'message');
  const privacy = lib.pick(b, 'privacy_consent');
  const token = lib.pick(b, 'g-recaptcha-response');

  if (!nome || !email || !azienda || !messaggio || !privacy) {
    lib.htmlResponse(res, 400, errorPage('campi mancanti (chiavi ricevute: ' + Object.keys(b).join(', ') + ')'));
    return;
  }
  if (!(await lib.verifyRecaptcha(token, lib.clientIp(req)))) {
    lib.htmlResponse(res, 400, errorPage('verifica reCAPTCHA fallita')); return;
  }

  const html = lib.emailShell(
    'Richiesta informazioni dal sito',
    '<table style="width:100%;border-collapse:collapse;font-size:14px;">'
      + lib.row('Nome', nome)
      + lib.row('Email', email)
      + lib.row('Telefono', telefono)
      + lib.row('Azienda', azienda)
      + lib.row('Ruolo', ruolo)
      + lib.row('Messaggio', messaggio)
      + '</table>',
    'Inviato dal modulo Contatti di euriskosrl.it'
  );

  try {
    await lib.sendEmail({
      from: lib.MAIL_FROM,
      to: 'info@euriskosrl.it',
      bcc: lib.BCC,
      reply_to: email,
      subject: 'Richiesta informazioni dal sito Eurisko',
      html: html,
    });
  } catch (e) {
    console.error('contact sendEmail error:', e && e.message);
    lib.htmlResponse(res, 502, errorPage('invio email: ' + (e && e.message))); return;
  }

  lib.redirect(res, thankYou);
};

// NB: la riga [debug] e' temporanea per diagnosticare; va rimossa dopo il fix.
function errorPage(detail) {
  return '<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><title>Invio non riuscito</title></head>'
    + '<body style="font-family:Arial,sans-serif;max-width:560px;margin:60px auto;padding:0 20px;color:#0A1628;text-align:center;line-height:1.6;">'
    + '<h1>Invio non riuscito</h1>'
    + '<p>Si &egrave; verificato un problema nell\'invio del messaggio. Riprova tra poco, oppure scrivici a '
    + '<a href="mailto:info@euriskosrl.it">info@euriskosrl.it</a> o chiamaci al '
    + '<a href="tel:+393481565772">+39 348 156 5772</a>.</p>'
    + (detail ? '<p style="color:#94a3b8;font-size:12px;">[debug] ' + lib.esc(detail) + '</p>' : '')
    + '<p><a href="/contatti">&larr; Torna ai contatti</a></p></body></html>';
}
