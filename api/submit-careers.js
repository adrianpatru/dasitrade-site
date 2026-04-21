const config = require('./_lib/config');
const {
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
} = require('./_lib/forms');

async function handler(req, res) {
  if (req.method !== 'POST') {
    sendFormResponse(req, res, false, 'Metoda invalida.', 'cariere.html', 405);
    return;
  }

  let parsed;
  try {
    parsed = await parseMultipart(req);
  } catch {
    sendFormResponse(req, res, false, 'Aplicatia nu a putut fi procesata.', 'cariere.html');
    return;
  }

  const { fields, files } = parsed;

  if (cleanText(first(fields.website), 200) !== '') {
    sendFormResponse(req, res, true, 'Aplicatie primita.', 'cariere.html');
    return;
  }

  if (!hasTrustedNavigationContext(req)) {
    sendFormResponse(req, res, false, 'Aplicatia a fost respinsa dintr-un context invalid.', 'cariere.html');
    return;
  }

  if (!validateCsrf(req, fields)) {
    sendFormResponse(req, res, false, 'Sesiunea formularului nu mai este valida. Reincarca pagina si incearca din nou.', 'cariere.html');
    return;
  }

  if (!enforceRateLimit('careers', 4, 1800, req)) {
    sendFormResponse(req, res, false, 'Au fost trimise prea multe aplicatii intr-un interval scurt. Incearca din nou mai tarziu.', 'cariere.html');
    return;
  }

  const name = cleanText(first(fields.name));
  const email = cleanEmail(first(fields.email));
  const phone = cleanPhone(first(fields.phone));
  const position = cleanText(first(fields.position), 120);
  const positionLabel = cleanText(first(fields.position_label), 160);
  const message = cleanMessage(first(fields.message));
  const privacyConsent = String(first(fields.privacy_consent) || '').trim();

  if (!name || !email || !position) {
    sendFormResponse(req, res, false, 'Completeaza campurile obligatorii.', 'cariere.html');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    sendFormResponse(req, res, false, 'Adresa de email nu este valida.', 'cariere.html');
    return;
  }

  if (privacyConsent !== '1') {
    sendFormResponse(req, res, false, 'Este necesar acordul pentru prelucrarea datelor.', 'cariere.html');
    return;
  }

  let attachment;
  try {
    attachment = await validateAttachment(firstFile(files.attachment));
  } catch (error) {
    sendFormResponse(req, res, false, error.message, 'cariere.html');
    return;
  }

  if (!attachment) {
    sendFormResponse(req, res, false, 'CV-ul este obligatoriu.', 'cariere.html');
    return;
  }

  const jobsMap = await loadJobsMap();
  const resolvedPosition = jobsMap[position] || positionLabel || position;

  const htmlBody = renderEmail(
    'Aplicatie noua in cariere',
    {
      'Nume': name,
      'Email': email,
      'Telefon': phone || 'Nespecificat',
      'Post vizat': resolvedPosition,
      'Cod pozitie': position,
      'Sursa': 'Formular cariere website',
    },
    message ? plainTextMessage(message) : 'Fara mesaj suplimentar.'
  );

  try {
    await sendMail({
      to: config.recipients.careers || config.recipients.default,
      subject: 'Aplicatie cariere Dasitrade',
      htmlBody,
      replyTo: email,
      attachment,
    });
  } catch (error) {
    sendFormResponse(req, res, false, publicMailFailureMessage(error), 'cariere.html');
    return;
  }

  sendFormResponse(req, res, true, 'Aplicatia a fost transmisa.', 'cariere.html');
}

module.exports = handler;
module.exports.config = {
  api: {
    bodyParser: false,
  },
};