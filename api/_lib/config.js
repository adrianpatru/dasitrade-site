const path = require('path');

module.exports = {
  formTokenCookie: 'dasitrade_form_token',
  maxUploadSize: 5 * 1024 * 1024,
  trustedHosts: new Set([
    'dasitrade-site.vercel.app',
    'dasitrade.ro',
    'www.dasitrade.ro',
    'localhost',
    '127.0.0.1',
  ]),
  recipients: {
    default: 'tehnic@dasitrade.ro',
    contact: 'tehnic@dasitrade.ro',
    careers: 'tehnic@dasitrade.ro',
  },
  mail: {
    fromEmail: 'smtp@dasitrade.ro',
    fromName: 'Dasitrade',
    host: 'webmail.dasitrade.ro',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'smtp@dasitrade.ro',
      pass: 'Door_met12.',
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  jobsPath: path.join(process.cwd(), 'jobs.json'),
};