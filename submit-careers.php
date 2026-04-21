<?php
declare(strict_types=1);

require_once __DIR__ . '/form-config.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    dasitradeFormResponse(false, 'Metoda invalida.', 'cariere.html');
}

if (!dasitradeValidateHoneypot()) {
    dasitradeFormResponse(true, 'Aplicatie primita.', 'cariere.html');
}

if (!dasitradeHasTrustedNavigationContext()) {
    dasitradeFormResponse(false, 'Aplicatia a fost respinsa dintr-un context invalid.', 'cariere.html');
}

if (!dasitradeValidateCsrfToken()) {
    dasitradeFormResponse(false, 'Sesiunea formularului nu mai este valida. Reincarca pagina si incearca din nou.', 'cariere.html');
}

if (!dasitradeEnforceRateLimit('careers', 4, 1800)) {
    dasitradeFormResponse(false, 'Au fost trimise prea multe aplicatii intr-un interval scurt. Incearca din nou mai tarziu.', 'cariere.html');
}

$name = dasitradeCleanText(dasitradePost('name'));
$email = dasitradeCleanEmail(dasitradePost('email'));
$phone = dasitradeCleanPhone(dasitradePost('phone'));
$position = dasitradeCleanText(dasitradePost('position'), 120);
$positionLabel = dasitradeCleanText(dasitradePost('position_label'), 160);
$message = dasitradeCleanMessage(dasitradePost('message'));
$privacyConsent = dasitradePost('privacy_consent');

if ($name === '' || $email === '' || $position === '') {
    dasitradeFormResponse(false, 'Completeaza campurile obligatorii.', 'cariere.html');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    dasitradeFormResponse(false, 'Adresa de email nu este valida.', 'cariere.html');
}

if ($privacyConsent !== '1') {
    dasitradeFormResponse(false, 'Este necesar acordul pentru prelucrarea datelor.', 'cariere.html');
}

try {
    $attachment = dasitradeUploadedAttachment('attachment');
} catch (UploadValidationException $exception) {
    dasitradeFormResponse(false, $exception->getMessage(), 'cariere.html');
}

if ($attachment === null) {
    dasitradeFormResponse(false, 'CV-ul este obligatoriu.', 'cariere.html');
}

$jobsPath = __DIR__ . '/jobs.json';
$positionMap = [];
if (is_file($jobsPath)) {
    $decoded = json_decode((string) file_get_contents($jobsPath), true);
    if (is_array($decoded['positions'] ?? null)) {
        foreach ($decoded['positions'] as $job) {
            if (!is_array($job) || !isset($job['id'], $job['title'])) {
                continue;
            }
            $positionMap[(string) $job['id']] = (string) $job['title'];
        }
    }
}

$resolvedPosition = $positionMap[$position] ?? ($positionLabel !== '' ? $positionLabel : $position);

$body = dasitradeRenderEmail(
    'Aplicatie noua in cariere',
    [
        'Nume' => $name,
        'Email' => $email,
        'Telefon' => $phone !== '' ? $phone : 'Nespecificat',
        'Post vizat' => $resolvedPosition,
        'Cod pozitie' => $position,
        'Sursa' => 'Formular cariere website',
    ],
    $message !== '' ? dasitradePlainTextMessage($message) : 'Fara mesaj suplimentar.'
);

$sent = dasitradeSendMail(
    dasitradeMailRecipient('careers', DASITRADE_HR_EMAIL),
    'Aplicatie cariere Dasitrade',
    $body,
    $email,
    $attachment
);

if (!$sent) {
    dasitradeFormResponse(false, dasitradePublicMailFailureMessage(), 'cariere.html');
}

dasitradeFormResponse(true, 'Aplicatia a fost transmisa.', 'cariere.html');
