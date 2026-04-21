const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const nodemailer = require('nodemailer');

const config = require('./config');

const rateLimits = globalThis.__dasitradeRateLimits || new Map();
globalThis.__dasitradeRateLimits = rateLimits;

let transporter;

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function firstFile(value) {
  return Array.isArray(value) ? value[0] : value || null;
}

function cleanText(value, maxLength = 200) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function cleanEmail(value) {
  return String(value || '').trim().replace(/[\r\n]+/g, '').slice(0, 320);
}

function cleanPhone(value) {
  return String(value || '').trim().replace(/[^0-9+()\-\s]/g, '').slice(0, 40);
}

function cleanMessage(value, maxLength = 4000) {
  return String(value || '')
    .trim()
    .replace(/\r\n?/g, '\n')
    .replace(/[^\P{C}\n\t]/gu, '')
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function plainTextMessage(value) {
  return String(value || '').replace(/\n{3,}/g, '\n\n').trim();
}

function htmlToText(html) {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderEmail(title, rows, message) {
  let items = '';

  for (const [label, value] of Object.entries(rows)) {
    if (value == null || value === '') {
      continue;
    }

    items += `<tr><td style="padding:10px 14px;border-bottom:1px solid #d7dadd;color:#5b636d;font-family:Arial,sans-serif;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">${escapeHtml(label)}</td><td style="padding:10px 14px;border-bottom:1px solid #d7dadd;color:#111827;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;">${escapeHtml(String(value)).replace(/\n/g, '<br/>')}</td></tr>`;
  }

  const messageBlock = message
    ? `<div style="margin-top:24px;padding:18px 20px;background:#f7f3ee;border:1px solid #d7dadd;"><div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5b636d;margin-bottom:10px;">Mesaj</div><div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#111827;white-space:pre-wrap;">${escapeHtml(message)}</div></div>`
    : '';

  return '<!doctype html><html lang="ro"><body style="margin:0;padding:32px;background:#f2f4f7;">'
    + '<div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #d7dadd;padding:28px 28px 32px;">'
    + '<div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#8a929b;margin-bottom:12px;">Dasitrade · site</div>'
    + `<h1 style="margin:0 0 20px;font-family:Georgia,serif;font-weight:400;font-size:28px;line-height:1.2;color:#111827;">${escapeHtml(title)}</h1>`
    + `<table style="width:100%;border-collapse:collapse;border:1px solid #d7dadd;">${items}</table>`
    + messageBlock
    + '</div></body></html>';
}

function parseCookies(req) {
  const cookieHeader = req.headers.cookie || '';
  const cookies = {};

  cookieHeader.split(/;\s*/).forEach(part => {
    if (!part) return;
    const [key, ...rest] = part.split('=');
    cookies[key] = decodeURIComponent(rest.join('='));
  });

  return cookies;
}

function hasTrustedNavigationContext(req) {
  const fetchSite = String(req.headers['sec-fetch-site'] || '').toLowerCase();
  if (fetchSite && !['same-origin', 'same-site', 'none'].includes(fetchSite)) {
    return false;
  }

  for (const headerName of ['origin', 'referer']) {
    const value = String(req.headers[headerName] || '').trim();
    if (!value) {
      continue;
    }

    try {
      const url = new URL(value);
      if (!config.trustedHosts.has(url.hostname.toLowerCase())) {
        return false;
      }
    } catch {
      continue;
    }
  }

  return true;
}

function validateCsrf(req, fields) {
  const posted = cleanText(first(fields.csrf_token), 64);
  const cookies = parseCookies(req);
  const cookie = cleanText(cookies[config.formTokenCookie] || '', 64);

  if (!posted && !cookie) {
    return true;
  }

  if (!posted || !cookie) {
    return false;
  }

  if (!/^[a-f0-9]{64}$/i.test(posted) || !/^[a-f0-9]{64}$/i.test(cookie)) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(posted), Buffer.from(cookie));
}

function clientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || req.socket?.remoteAddress || 'unknown';
}

function enforceRateLimit(bucket, maxAttempts, windowSeconds, req) {
  const key = `${bucket}|${clientIp(req)}`;
  const now = Date.now();
  const cutoff = now - windowSeconds * 1000;
  const attempts = (rateLimits.get(key) || []).filter(timestamp => timestamp > cutoff);

  if (attempts.length >= maxAttempts) {
    rateLimits.set(key, attempts);
    return false;
  }

  attempts.push(now);
  rateLimits.set(key, attempts);
  return true;
}

function createFormidable() {
  return formidable({
    multiples: false,
    maxFileSize: config.maxUploadSize,
    allowEmptyFiles: false,
    keepExtensions: true,
  });
}

function parseMultipart(req) {
  const form = createFormidable();

  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({ fields, files });
    });
  });
}

async function readFilePrefix(filePath, length) {
  const handle = await fs.promises.open(filePath, 'r');
  const buffer = Buffer.alloc(length);

  try {
    const { bytesRead } = await handle.read(buffer, 0, length, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

async function validateAttachment(file) {
  if (!file) {
    return null;
  }

  const originalName = String(file.originalFilename || 'document');
  const extension = path.extname(originalName).slice(1).toLowerCase();
  const allowed = {
    pdf: ['application/pdf', 'application/octet-stream'],
    doc: ['application/msword', 'application/octet-stream', 'application/CDFV2', 'application/vnd.ms-office', 'application/x-tika-msoffice'],
    docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream', 'application/x-tika-ooxml'],
  };

  if (!allowed[extension]) {
    throw new Error('Acceptam doar fisiere PDF, DOC sau DOCX.');
  }

  const size = Number(file.size || 0);
  if (size <= 0 || size > config.maxUploadSize) {
    throw new Error('Fisierul depaseste limita de 5 MB.');
  }

  const mime = String(file.mimetype || '').trim();
  if (mime && !allowed[extension].includes(mime)) {
    throw new Error('Fisierul incarcat nu corespunde tipului declarat. Acceptam doar PDF, DOC sau DOCX valide.');
  }

  const prefix = await readFilePrefix(file.filepath, extension === 'doc' ? 8 : 4);
  if (extension === 'pdf' && prefix.toString('ascii', 0, 4) !== '%PDF') {
    throw new Error('Fisierul incarcat nu are structura interna asteptata pentru tipul selectat.');
  }

  if (extension === 'doc' && prefix.toString('hex') !== 'd0cf11e0a1b11ae1') {
    throw new Error('Fisierul incarcat nu are structura interna asteptata pentru tipul selectat.');
  }

  if (extension === 'docx' && prefix.toString('ascii', 0, 2) !== 'PK') {
    throw new Error('Fisierul incarcat nu are structura interna asteptata pentru tipul selectat.');
  }

  let safeName = path.basename(originalName).replace(/[^A-Za-z0-9._-]/g, '-');
  if (!safeName) {
    safeName = `document.${extension}`;
  }

  return {
    filepath: file.filepath,
    name: safeName,
    mime: allowed[extension][0],
  };
}

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport(config.mail);
  }

  return transporter;
}

async function sendMail({ to, subject, htmlBody, replyTo, attachment }) {
  const message = {
    from: `"${config.mail.fromName}" <${config.mail.fromEmail}>`,
    to,
    subject,
    html: htmlBody,
    text: htmlToText(htmlBody),
  };

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(replyTo || '').trim())) {
    message.replyTo = String(replyTo).trim();
  }

  if (attachment) {
    message.attachments = [
      {
        filename: attachment.name,
        path: attachment.filepath,
        contentType: attachment.mime,
      },
    ];
  }

  await getTransporter().sendMail(message);
}

function publicMailFailureMessage(error) {
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('certificate')) {
    return 'Conexiunea SMTP a eșuat din cauza certificatului serverului de mail.';
  }
  if (message.includes('auth') || message.includes('authentication')) {
    return 'Autentificarea SMTP a eșuat. Verifica parola sau utilizatorul de mail.';
  }
  return 'Cererea nu a putut fi trimisa momentan.';
}

function sendFormResponse(req, res, success, message, redirectPath, statusCode = success ? 200 : 422) {
  const accept = String(req.headers.accept || '').toLowerCase();
  const requestedWith = String(req.headers['x-requested-with'] || '').toLowerCase();

  if (accept.includes('application/json') || requestedWith === 'xmlhttprequest') {
    res.status(statusCode).json({ success, message });
    return;
  }

  res.writeHead(302, {
    Location: `${redirectPath}?status=${success ? 'success' : 'error'}`,
  });
  res.end();
}

async function loadJobsMap() {
  try {
    const raw = await fs.promises.readFile(config.jobsPath, 'utf8');
    const decoded = JSON.parse(raw);
    const map = {};

    for (const job of decoded.positions || []) {
      if (!job || typeof job !== 'object') {
        continue;
      }

      if (typeof job.id === 'string' && typeof job.title === 'string') {
        map[job.id] = job.title;
      }
    }

    return map;
  } catch {
    return {};
  }
}

module.exports = {
  cleanEmail,
  cleanMessage,
  cleanPhone,
  cleanText,
  enforceRateLimit,
  first,
  firstFile,
  hasTrustedNavigationContext,
  loadJobsMap,
  parseMultipart,
  plainTextMessage,
  publicMailFailureMessage,
  renderEmail,
  sendFormResponse,
  sendMail,
  validateAttachment,
  validateCsrf,
};