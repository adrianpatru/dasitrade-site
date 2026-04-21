const config = require('./_lib/config');
const {
  cleanEmail,
  cleanMessage,
  cleanPhone,
  cleanText,
  enforceRateLimit,
  first,
  hasTrustedNavigationContext,
  parseMultipart,
  plainTextMessage,
  publicMailFailureMessage,
  renderEmail,
  sendFormResponse,
  sendMail,
  validateCsrf,
} = require('./_lib/forms');

async function handler(req, res) {
  if (req.method !== 'POST') {
    sendFormResponse(req, res, false, 'Metoda invalida.', 'contact.html', 405);
    return;
  }

  let parsed;
  try {
    parsed = await parseMultipart(req);
  } catch (error) {
    console.error('Contact form parse error:', error);
    sendFormResponse(req, res, false, 'Cererea nu a putut fi procesata.', 'contact.html');
    return;
  }

  const { fields } = parsed;

  if (cleanText(first(fields.website), 200) !== '') {
    sendFormResponse(req, res, true, 'Solicitare primita.', 'contact.html');
    return;
  }

  if (!hasTrustedNavigationContext(req)) {
    sendFormResponse(req, res, false, 'Solicitare respinsa dintr-un context invalid.', 'contact.html');
    return;
  }

  if (!validateCsrf(req, fields)) {
    sendFormResponse(req, res, false, 'Sesiunea formularului nu mai este valida. Reincarca pagina si incearca din nou.', 'contact.html');
    return;
  }

  if (!enforceRateLimit('contact', 6, 900, req)) {
    sendFormResponse(req, res, false, 'Au fost trimise prea multe solicitari intr-un interval scurt. Incearca din nou peste cateva minute.', 'contact.html');
    return;
  }

  const name = cleanText(first(fields.name));
  const email = cleanEmail(first(fields.email));
  const phone = cleanPhone(first(fields.phone));
  const projectType = cleanText(first(fields.project_type), 120);
  const message = cleanMessage(first(fields.message));
  const privacyAck = String(first(fields.privacy_ack) || '').trim();

  if (!name || !email || !projectType || !message) {
    sendFormResponse(req, res, false, 'Completeaza campurile obligatorii.', 'contact.html');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    sendFormResponse(req, res, false, 'Adresa de email nu este valida.', 'contact.html');
    return;
  }

  if (privacyAck !== '1') {
    sendFormResponse(req, res, false, 'Este necesar acordul privind confidentialitatea.', 'contact.html');
    return;
  }

  const htmlBody = renderEmail(
    'Cerere noua de contact',
    {
      'Nume / companie': name,
      'Email': email,
      'Telefon': phone || 'Nespecificat',
      'Tip proiect': projectType,
      'Sursa': 'Formular contact website',
    },
    plainTextMessage(message)
  );

  try {
    await sendMail({
      to: config.recipients.contact || config.recipients.default,
      subject: 'Contact site Dasitrade',
      htmlBody,
      replyTo: email,
    });
  } catch (error) {
    sendFormResponse(req, res, false, publicMailFailureMessage(error), 'contact.html');
    return;
  }

  sendFormResponse(req, res, true, 'Cererea a fost transmisa.', 'contact.html');
}

module.exports = handler;
module.exports.config = {
  api: {
    bodyParser: false,
  },
};