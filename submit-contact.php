<?php
declare(strict_types=1);

require_once __DIR__ . '/form-config.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    dasitradeFormResponse(false, 'Metoda invalida.', 'contact.html');
}

if (!dasitradeValidateHoneypot()) {
    dasitradeFormResponse(true, 'Solicitare primita.', 'contact.html');
}

if (!dasitradeHasTrustedNavigationContext()) {
    dasitradeFormResponse(false, 'Solicitare respinsa dintr-un context invalid.', 'contact.html');
}

if (!dasitradeValidateCsrfToken()) {
    dasitradeFormResponse(false, 'Sesiunea formularului nu mai este valida. Reincarca pagina si incearca din nou.', 'contact.html');
}

if (!dasitradeEnforceRateLimit('contact', 6, 900)) {
    dasitradeFormResponse(false, 'Au fost trimise prea multe solicitari intr-un interval scurt. Incearca din nou peste cateva minute.', 'contact.html');
}

$name = dasitradeCleanText(dasitradePost('name'));
$email = dasitradeCleanEmail(dasitradePost('email'));
$phone = dasitradeCleanPhone(dasitradePost('phone'));
$projectType = dasitradeCleanText(dasitradePost('project_type'), 120);
$message = dasitradeCleanMessage(dasitradePost('message'));
$privacyAck = dasitradePost('privacy_ack');

if ($name === '' || $email === '' || $projectType === '' || $message === '') {
    dasitradeFormResponse(false, 'Completeaza campurile obligatorii.', 'contact.html');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    dasitradeFormResponse(false, 'Adresa de email nu este valida.', 'contact.html');
}

if ($privacyAck !== '1') {
    dasitradeFormResponse(false, 'Este necesar acordul privind confidentialitatea.', 'contact.html');
}

$body = dasitradeRenderEmail(
    'Cerere noua de contact',
    [
        'Nume / companie' => $name,
        'Email' => $email,
        'Telefon' => $phone !== '' ? $phone : 'Nespecificat',
        'Tip proiect' => $projectType,
        'Sursa' => 'Formular contact website',
    ],
    dasitradePlainTextMessage($message)
);

$sent = dasitradeSendMail(
    dasitradeMailRecipient('contact', DASITRADE_OFFICE_EMAIL),
    'Contact site Dasitrade',
    $body,
    $email
);

if (!$sent) {
    dasitradeFormResponse(false, 'Cererea nu a putut fi trimisa momentan.', 'contact.html');
}

dasitradeFormResponse(true, 'Cererea a fost transmisa.', 'contact.html');
