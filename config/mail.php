<?php
declare(strict_types=1);

$smtpPassword = getenv('DASITRADE_SMTP_PASSWORD');
if ($smtpPassword === false || $smtpPassword === '') {
    $smtpPassword = isset($_SERVER['DASITRADE_SMTP_PASSWORD']) && is_string($_SERVER['DASITRADE_SMTP_PASSWORD'])
        ? $_SERVER['DASITRADE_SMTP_PASSWORD']
        : '';
}

if ($smtpPassword === '' && isset($_ENV['DASITRADE_SMTP_PASSWORD']) && is_string($_ENV['DASITRADE_SMTP_PASSWORD'])) {
    $smtpPassword = $_ENV['DASITRADE_SMTP_PASSWORD'];
}

return [
    'transport' => 'smtp',
    'fallback_to_mail' => true,
    'from_email' => 'smtp@dasitrade.ro',
    'from_name' => 'Dasitrade',
    'recipients' => [
        'default' => 'tehnic@dasitrade.ro',
        'contact' => 'tehnic@dasitrade.ro',
        'careers' => 'tehnic@dasitrade.ro',
    ],
    'smtp' => [
        'host' => 'webmail.dasitrade.ro',
        'port' => 587,
        'security' => 'tls',
        'username' => 'smtp@dasitrade.ro',
        'password' => $smtpPassword,
        'auth' => true,
        'timeout' => 15,
    ],
];