'use strict';

const Busboy = require('busboy');
const lib = require('./_lib.js');

const MAX_CV = 4 * 1024 * 1024; // 4 MB

module.exports = async (req, res) => {
  if (req.method !== 'POST') { lib.htmlResponse(res, 405, 'Method Not Allowed'); return; }

  let parsed;
  try {
    parsed = await parseMultipart(req);
  } catch (e) {
    const tooBig = !!(e && e.tooBig);
    if (!tooBig) console.error('careers parse error:', e && e.message);
    lib.htmlResponse(res, tooBig ? 413 : 400, errorPage(tooBig));
    return;
  }

  const f = parsed.fields;
  const lang = lib.pick(f, 'lang') === 'en' ? 'en' : 'it';
  const thankYou = lang === 'en' ? '/en/thank-you-application' : '/grazie-candidatura';

  if (lib.pick(f, '_honey')) { lib.redirect(res, thankYou); return; }

  const nome = lib.pick(f, 'nome', 'first_name');
  const cognome = lib.pick(f, 'cognome', 'last_name');
  const citta = lib.pick(f, 'citta', 'city');
  const email = lib.pick(f, 'email');
  const prefisso = lib.pick(f, 'prefisso', 'dial_code');
  const telefono = lib.pick(f, 'telefono', 'phone');
  const linkedin = lib.pick(f, 'linkedin');
  const esperienza = lib.pick(f, 'esperienza', 'experience');
  const modulo = lib.pick(f, 'modulo', 'module');
  const permesso = lib.pick(f, 'permesso_lavoro', 'work_permit');
  const categorie = lib.pick(f, 'categorie_protette', 'protected_categories');
  const presentazione = lib.pick(f, 'presentazione', 'presentation');
  const privacy = lib.pick(f, 'privacy_consent');
  const token = lib.pick(f, 'g-recaptcha-response');

  if (!nome || !cognome || !citta || !email || !telefono || !esperienza
      || !permesso || !categorie || !presentazione || !privacy || !parsed.file) {
    lib.htmlResponse(res, 400, errorPage(false)); return;
  }
  if (!(await lib.verifyRecaptcha(token, lib.clientIp(req)))) {
    lib.htmlResponse(res, 400, errorPage(false)); return;
  }

  const fullName = (nome + ' ' + cognome).trim();
  const tel = (prefisso ? prefisso + ' ' : '') + telefono;
  const subject = modulo
    ? 'Nuova candidatura modulo ' + modulo + ' dal sito Eurisko'
    : 'Nuova candidatura spontanea dal sito Eurisko';

  const html = lib.emailShell(
    'Nuova candidatura — Lavora con noi',
    '<table style="width:100%;border-collapse:collapse;font-size:14px;">'
      + lib.row('Nome', fullName)
      + lib.row('Città', citta)
      + lib.row('Email', email)
      + lib.row('Telefono', tel)
      + lib.row('LinkedIn', linkedin)
      + lib.row('Anni esperienza SAP', esperienza)
      + lib.row('Modulo', modulo)
      + lib.row('Permesso di lavoro', permesso)
      + lib.row('Categorie protette', categorie)
      + lib.row('Presentazione', presentazione)
      + '</table>',
    'Candidatura inviata dal modulo Lavora con noi di euriskosrl.it &middot; CV in allegato'
  );

  try {
    await lib.sendEmail({
      from: lib.MAIL_FROM,
      to: 'careers@euriskosrl.it',
      bcc: lib.BCC,
      reply_to: email,
      subject: subject,
      html: html,
      attachments: [{
        filename: parsed.file.filename || 'cv',
        content: parsed.file.buffer.toString('base64'),
      }],
    });
  } catch (e) {
    console.error('careers sendEmail error:', e && e.message);
    lib.htmlResponse(res, 502, errorPage(false)); return;
  }

  // Conferma automatica al candidato (best-effort: un errore qui non blocca la candidatura).
  try {
    const ar = lang === 'en'
      ? {
          subj: 'We’ve received your application — Eurisko',
          body: 'Hi ' + lib.esc(nome) + ',<br><br>'
            + 'thank you for submitting your application to Eurisko: we have correctly received your details and your CV.<br><br>'
            + 'Your profile will be kept and evaluated in relation to our current and future recruitment needs. Should it match an open position, you will be contacted by our team.<br><br>'
            + 'Thank you for your interest in Eurisko.<br><br>&mdash; The Eurisko team',
          note: 'Your data and CV are processed for recruitment purposes and kept for 12 months; you can request deletion by writing to careers@euriskosrl.it. Details in the <a href="https://euriskosrl.it/en/privacy" style="color:#64748b;">Privacy Policy</a>.<br>Eurisko S.r.l. &middot; SAP Consulting Services — automated message.',
        }
      : {
          subj: 'Abbiamo ricevuto la tua candidatura — Eurisko',
          body: 'Ciao ' + lib.esc(nome) + ',<br><br>'
            + 'grazie per aver inviato la tua candidatura a Eurisko: abbiamo ricevuto correttamente i tuoi dati e il tuo CV.<br><br>'
            + 'Il tuo profilo verrà conservato e valutato in relazione alle nostre ricerche di personale, attuali e future. Qualora risultasse in linea con una posizione, sarai contattato/a dal nostro team.<br><br>'
            + 'Grazie per l\'interesse che hai dimostrato verso Eurisko.<br><br>&mdash; Il team Eurisko',
          note: 'I tuoi dati e il CV sono trattati per finalità di selezione del personale e conservati per 12 mesi; puoi chiederne la cancellazione scrivendo a careers@euriskosrl.it. Dettagli nella <a href="https://euriskosrl.it/privacy" style="color:#64748b;">Privacy Policy</a>.<br>Eurisko S.r.l. &middot; Servizi di Consulenza SAP — messaggio automatico.',
        };
    await lib.sendEmail({
      from: lib.MAIL_FROM,
      to: email,
      reply_to: 'careers@euriskosrl.it',
      subject: ar.subj,
      html: lib.emailShell(ar.subj, '<div style="font-size:14px;line-height:1.6;color:#0A1628;">' + ar.body + '</div>', ar.note),
    });
  } catch (e) { /* ignora: la candidatura e' gia' stata inviata */ }

  lib.redirect(res, thankYou);
};

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    let bb;
    try {
      bb = Busboy({ headers: req.headers, limits: { fileSize: MAX_CV, files: 1, fields: 50 } });
    } catch (e) { reject(e); return; }

    const fields = {};
    const chunks = [];
    let fileInfo = null;
    let tooBig = false;

    bb.on('field', (name, val) => { fields[name] = val; });
    bb.on('file', (name, stream, info) => {
      if (name !== 'cv') { stream.resume(); return; }
      fileInfo = info;
      stream.on('data', (d) => { chunks.push(d); });
      stream.on('limit', () => { tooBig = true; });
    });
    bb.on('error', reject);
    bb.on('close', () => {
      if (tooBig) { const e = new Error('TOO_BIG'); e.tooBig = true; reject(e); return; }
      const file = chunks.length
        ? { filename: fileInfo && fileInfo.filename, buffer: Buffer.concat(chunks) }
        : null;
      resolve({ fields: fields, file: file });
    });

    req.pipe(bb);
  });
}

function errorPage(tooBig) {
  const msg = tooBig
    ? 'Il file CV supera il limite di 4 MB. Comprimilo e riprova, oppure invialo via email.'
    : 'Si &egrave; verificato un problema nell\'invio della candidatura. Riprova tra poco.';
  return '<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><title>Invio non riuscito</title></head>'
    + '<body style="font-family:Arial,sans-serif;max-width:560px;margin:60px auto;padding:0 20px;color:#0A1628;text-align:center;line-height:1.6;">'
    + '<h1>Invio non riuscito</h1>'
    + '<p>' + msg + ' Puoi scriverci a <a href="mailto:careers@euriskosrl.it">careers@euriskosrl.it</a>.</p>'
    + '<p><a href="/lavora-con-noi">&larr; Torna a Lavora con noi</a></p></body></html>';
}
