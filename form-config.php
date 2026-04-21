<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/PHPMailer/src/Exception.php';
require_once __DIR__ . '/lib/PHPMailer/src/SMTP.php';
require_once __DIR__ . '/lib/PHPMailer/src/PHPMailer.php';

const DASITRADE_OFFICE_EMAIL = 'tehnic@dasitrade.ro';
const DASITRADE_TECH_EMAIL = 'tehnic@dasitrade.ro';
const DASITRADE_HR_EMAIL = 'tehnic@dasitrade.ro';
const DASITRADE_MAX_UPLOAD_SIZE = 5242880;
const DASITRADE_CRLF = "\r\n";
const DASITRADE_BLANK_LINE = "\r\n\r\n";
const DASITRADE_CSRF_COOKIE = 'dasitrade_form_token';

final class UploadValidationException extends RuntimeException
{
}

function dasitradeMergeConfig(array $base, array $override): array
{
    foreach ($override as $key => $value) {
        if (is_array($value) && is_array($base[$key] ?? null)) {
            $base[$key] = dasitradeMergeConfig($base[$key], $value);
            continue;
        }

        $base[$key] = $value;
    }

    return $base;
}

function dasitradeMailConfig(): array
{
    static $config = null;

    if (is_array($config)) {
        return $config;
    }

    $config = [];

    $basePath = __DIR__ . '/config/mail.php';
    if (is_file($basePath)) {
        $loaded = require $basePath;
        if (is_array($loaded)) {
            $config = $loaded;
        }
    }

    $localPath = __DIR__ . '/config/mail.local.php';
    if (is_file($localPath)) {
        $loaded = require $localPath;
        if (is_array($loaded)) {
            $config = dasitradeMergeConfig($config, $loaded);
        }
    }

    return $config;
}

function dasitradeMailTransport(): string
{
    $transport = strtolower(trim((string) (dasitradeMailConfig()['transport'] ?? 'mail')));
    return in_array($transport, ['mail', 'smtp'], true) ? $transport : 'mail';
}

function dasitradeMailFallbackEnabled(): bool
{
    return (bool) (dasitradeMailConfig()['fallback_to_mail'] ?? true);
}

function dasitradeMailFromEmail(): string
{
    $configured = dasitradeCleanEmail((string) (dasitradeMailConfig()['from_email'] ?? ''));
    return $configured !== '' ? $configured : DASITRADE_TECH_EMAIL;
}

function dasitradeMailFromName(): string
{
    $configured = dasitradeCleanText((string) (dasitradeMailConfig()['from_name'] ?? 'Dasitrade'), 120);
    return $configured !== '' ? $configured : 'Dasitrade';
}

function dasitradeMailRecipient(string $channel, string $fallback): string
{
    $recipients = dasitradeMailConfig()['recipients'] ?? [];
    if (!is_array($recipients)) {
        return $fallback;
    }

    $configured = dasitradeCleanEmail((string) ($recipients[$channel] ?? $recipients['default'] ?? ''));
    return $configured !== '' ? $configured : $fallback;
}

function dasitradeSmtpConfig(): array
{
    $smtp = dasitradeMailConfig()['smtp'] ?? [];
    if (!is_array($smtp)) {
        $smtp = [];
    }

    $port = (int) ($smtp['port'] ?? 587);
    $timeout = (int) ($smtp['timeout'] ?? 15);

    return [
        'host' => trim((string) ($smtp['host'] ?? '')),
        'port' => $port > 0 ? $port : 587,
        'security' => strtolower(trim((string) ($smtp['security'] ?? 'tls'))),
        'username' => trim((string) ($smtp['username'] ?? '')),
        'password' => (string) ($smtp['password'] ?? ''),
        'auth' => !array_key_exists('auth', $smtp) || (bool) $smtp['auth'],
        'timeout' => $timeout > 0 ? $timeout : 15,
    ];
}

function dasitradeSmtpConfigured(): bool
{
    $smtp = dasitradeSmtpConfig();
    if ($smtp['host'] === '') {
        return false;
    }

    if (!$smtp['auth']) {
        return true;
    }

    return $smtp['username'] !== '' && $smtp['password'] !== '';
}

function dasitradeLogMailError(string $message): void
{
    error_log('[Dasitrade mail] ' . $message);
}

function dasitradeIsAjaxRequest(): bool
{
    $accept = strtolower((string) ($_SERVER['HTTP_ACCEPT'] ?? ''));
    $requestedWith = strtolower((string) ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? ''));

    return strpos($accept, 'application/json') !== false || $requestedWith === 'xmlhttprequest';
}

function dasitradeLimitText(string $value, int $maxLength): string
{
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength);
    }

    return substr($value, 0, $maxLength);
}

function dasitradePost(string $key): string
{
    return isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
}

function dasitradeClientIp(): string
{
    $ip = trim((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    return $ip !== '' ? substr($ip, 0, 64) : 'unknown';
}

function dasitradeTrustedHosts(): array
{
    return [
        'www.dasitrade.ro',
        'dasitrade.ro',
        'localhost',
        '127.0.0.1',
    ];
}

function dasitradeCleanText(string $value, int $maxLength = 200): string
{
    $value = preg_replace('/\s+/u', ' ', trim($value)) ?? '';
    return dasitradeLimitText($value, $maxLength);
}

function dasitradeCleanEmail(string $value): string
{
    $value = filter_var(trim($value), FILTER_SANITIZE_EMAIL);
    return is_string($value) ? $value : '';
}

function dasitradeCleanPhone(string $value): string
{
    $value = preg_replace('/[^0-9+()\-\s]/', '', trim($value)) ?? '';
    return substr($value, 0, 40);
}

function dasitradeCleanMessage(string $value, int $maxLength = 4000): string
{
    $value = str_replace(["\r\n", "\r"], "\n", trim($value));
    $value = preg_replace('/[^\P{C}\n\t]/u', '', $value) ?? '';
    return dasitradeLimitText($value, $maxLength);
}

function dasitradeEscape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function dasitradePlainTextMessage(string $value): string
{
    return trim(preg_replace('/\n{3,}/', "\n\n", $value) ?? $value);
}

function dasitradeHasTrustedNavigationContext(): bool
{
    $fetchSite = strtolower((string) ($_SERVER['HTTP_SEC_FETCH_SITE'] ?? ''));
    if ($fetchSite !== '' && !in_array($fetchSite, ['same-origin', 'same-site', 'none'], true)) {
        return false;
    }

    foreach (['HTTP_ORIGIN', 'HTTP_REFERER'] as $header) {
        $value = trim((string) ($_SERVER[$header] ?? ''));
        if ($value === '') {
            continue;
        }

        $host = strtolower((string) parse_url($value, PHP_URL_HOST));
        if ($host === '') {
            continue;
        }

        if (!in_array($host, dasitradeTrustedHosts(), true)) {
            return false;
        }
    }

    return true;
}

function dasitradeValidateCsrfToken(): bool
{
    $postedToken = dasitradePost('csrf_token');
    $cookieToken = isset($_COOKIE[DASITRADE_CSRF_COOKIE]) ? trim((string) $_COOKIE[DASITRADE_CSRF_COOKIE]) : '';

    if ($postedToken === '' && $cookieToken === '') {
        return true;
    }

    if ($postedToken === '' || $cookieToken === '') {
        return false;
    }

    if (!preg_match('/^[a-f0-9]{64}$/i', $postedToken) || !preg_match('/^[a-f0-9]{64}$/i', $cookieToken)) {
        return false;
    }

    return hash_equals($cookieToken, $postedToken);
}

function dasitradeEnforceRateLimit(string $bucket, int $maxAttempts, int $windowSeconds): bool
{
    $directory = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'dasitrade-form-rate-limit';
    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) {
        return true;
    }

    $cacheKey = hash('sha256', $bucket . '|' . dasitradeClientIp());
    $path = $directory . DIRECTORY_SEPARATOR . $cacheKey . '.json';
    $now = time();
    $attempts = [];

    if (is_file($path)) {
        $decoded = json_decode((string) file_get_contents($path), true);
        if (is_array($decoded)) {
            foreach ($decoded as $timestamp) {
                if (is_int($timestamp) && $timestamp > ($now - $windowSeconds)) {
                    $attempts[] = $timestamp;
                }
            }
        }
    }

    if (count($attempts) >= $maxAttempts) {
        return false;
    }

    $attempts[] = $now;
    @file_put_contents($path, json_encode($attempts), LOCK_EX);

    return true;
}

function dasitradeFormResponse(bool $success, string $message, string $redirectPath)
{
    if (dasitradeIsAjaxRequest()) {
        http_response_code($success ? 200 : 422);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success' => $success,
            'message' => $message,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    $status = $success ? 'success' : 'error';
    header('Location: ' . $redirectPath . '?status=' . $status);
    exit;
}

function dasitradeRenderEmail(string $title, array $rows, ?string $message = null): string
{
    $items = '';

    foreach ($rows as $label => $value) {
        if ($value === null || $value === '') {
            continue;
        }

        $items .= sprintf(
            '<tr><td style="padding:10px 14px;border-bottom:1px solid #d7dadd;color:#5b636d;font-family:Arial,sans-serif;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">%s</td><td style="padding:10px 14px;border-bottom:1px solid #d7dadd;color:#111827;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;">%s</td></tr>',
            dasitradeEscape((string) $label),
            nl2br(dasitradeEscape((string) $value))
        );
    }

    $messageBlock = '';
    if ($message !== null && $message !== '') {
        $messageBlock = sprintf(
            '<div style="margin-top:24px;padding:18px 20px;background:#f7f3ee;border:1px solid #d7dadd;"><div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5b636d;margin-bottom:10px;">Mesaj</div><div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#111827;white-space:pre-wrap;">%s</div></div>',
            dasitradeEscape($message)
        );
    }

    return '<!doctype html><html lang="ro"><body style="margin:0;padding:32px;background:#f2f4f7;">'
        . '<div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #d7dadd;padding:28px 28px 32px;">'
        . '<div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#8a929b;margin-bottom:12px;">Dasitrade · site</div>'
        . '<h1 style="margin:0 0 20px;font-family:Georgia,serif;font-weight:400;font-size:28px;line-height:1.2;color:#111827;">' . dasitradeEscape($title) . '</h1>'
        . '<table style="width:100%;border-collapse:collapse;border:1px solid #d7dadd;">' . $items . '</table>'
        . $messageBlock
        . '</div></body></html>';
}

function dasitradeSendMailViaPhpMail(string $to, string $subject, string $htmlBody, ?string $replyTo = null, ?array $attachment = null): bool
{
    $fromEmail = dasitradeMailFromEmail();
    $fromName = dasitradeMailFromName();
    $headers = [
        'MIME-Version: 1.0',
        'From: ' . $fromName . ' <' . $fromEmail . '>',
        'X-Mailer: DasitradeSite',
    ];

    if ($replyTo !== null && $replyTo !== '') {
        $headers[] = 'Reply-To: ' . $replyTo;
    }

    $plainText = trim(preg_replace('/\s+/', ' ', strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $htmlBody))) ?? '');

    if ($attachment === null) {
        $headers[] = 'Content-Type: text/html; charset=UTF-8';
        return mail($to, $subject, $htmlBody, implode(DASITRADE_CRLF, $headers));
    }

    $boundary = 'dasitrade_' . md5((string) microtime(true));
    $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';

    $fileContents = file_get_contents($attachment['tmp_name']);
    if ($fileContents === false) {
        return false;
    }

    $body = '--' . $boundary . DASITRADE_CRLF;
    $body .= 'Content-Type: text/plain; charset=UTF-8' . DASITRADE_BLANK_LINE . $plainText . DASITRADE_BLANK_LINE;
    $body .= '--' . $boundary . DASITRADE_CRLF;
    $body .= 'Content-Type: text/html; charset=UTF-8' . DASITRADE_BLANK_LINE . $htmlBody . DASITRADE_BLANK_LINE;
    $body .= '--' . $boundary . DASITRADE_CRLF;
    $body .= 'Content-Type: ' . $attachment['mime'] . '; name="' . $attachment['name'] . '"' . DASITRADE_CRLF;
    $body .= 'Content-Transfer-Encoding: base64' . DASITRADE_CRLF;
    $body .= 'Content-Disposition: attachment; filename="' . $attachment['name'] . '"' . DASITRADE_BLANK_LINE;
    $body .= chunk_split(base64_encode($fileContents)) . DASITRADE_CRLF;
    $body .= '--' . $boundary . '--';

    return mail($to, $subject, $body, implode(DASITRADE_CRLF, $headers));
}

function dasitradeSendMailViaSmtp(string $to, string $subject, string $htmlBody, ?string $replyTo = null, ?array $attachment = null): bool
{
    $smtp = dasitradeSmtpConfig();
    $fromEmail = dasitradeMailFromEmail();
    $fromName = dasitradeMailFromName();
    $plainText = trim(preg_replace('/\s+/', ' ', strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $htmlBody))) ?? '');

    try {
        $mailer = new \PHPMailer\PHPMailer\PHPMailer(true);
        $mailer->CharSet = 'UTF-8';
        $mailer->Timeout = $smtp['timeout'];
        $mailer->isSMTP();
        $mailer->Host = $smtp['host'];
        $mailer->Port = $smtp['port'];
        $mailer->SMTPAuth = $smtp['auth'];
        $mailer->Username = $smtp['username'];
        $mailer->Password = $smtp['password'];
        $mailer->SMTPAutoTLS = true;

        if ($smtp['security'] === 'ssl') {
            $mailer->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        } elseif ($smtp['security'] === 'tls') {
            $mailer->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        }

        $mailer->setFrom($fromEmail, $fromName);
        $mailer->addAddress($to);

        if ($replyTo !== null && $replyTo !== '' && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
            $mailer->addReplyTo($replyTo);
        }

        if ($attachment !== null) {
            $mailer->addAttachment(
                $attachment['tmp_name'],
                $attachment['name'],
                \PHPMailer\PHPMailer\PHPMailer::ENCODING_BASE64,
                $attachment['mime']
            );
        }

        $mailer->isHTML(true);
        $mailer->Subject = $subject;
        $mailer->Body = $htmlBody;
        $mailer->AltBody = $plainText;

        return $mailer->send();
    } catch (\Throwable $exception) {
        dasitradeLogMailError('SMTP send failed: ' . $exception->getMessage());
        return false;
    }
}

function dasitradeSendMail(string $to, string $subject, string $htmlBody, ?string $replyTo = null, ?array $attachment = null): bool
{
    $transport = dasitradeMailTransport();

    if ($transport === 'smtp') {
        if (dasitradeSmtpConfigured()) {
            if (dasitradeSendMailViaSmtp($to, $subject, $htmlBody, $replyTo, $attachment)) {
                return true;
            }

            if (!dasitradeMailFallbackEnabled()) {
                return false;
            }
        } else {
            dasitradeLogMailError('SMTP transport selected but credentials are incomplete. Falling back to mail().');
            if (!dasitradeMailFallbackEnabled()) {
                return false;
            }
        }
    }

    return dasitradeSendMailViaPhpMail($to, $subject, $htmlBody, $replyTo, $attachment);
}

function dasitradeValidateHoneypot(): bool
{
    return dasitradePost('website') === '';
}

function dasitradeUploadedMimeType(string $tmpName): string
{
    if (!function_exists('finfo_open')) {
        return '';
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    if ($finfo === false) {
        return '';
    }

    $mime = finfo_file($finfo, $tmpName);
    finfo_close($finfo);

    return is_string($mime) ? trim($mime) : '';
}

function dasitradeReadFilePrefix(string $tmpName, int $length): string
{
    $handle = @fopen($tmpName, 'rb');
    if ($handle === false) {
        return '';
    }

    $prefix = (string) fread($handle, $length);
    fclose($handle);

    return $prefix;
}

function dasitradeValidateAttachmentSignature(string $tmpName, string $extension): bool
{
    $extension = strtolower($extension);

    if ($extension === 'pdf') {
        return str_starts_with(dasitradeReadFilePrefix($tmpName, 4), '%PDF');
    }

    if ($extension === 'doc') {
        return bin2hex(dasitradeReadFilePrefix($tmpName, 8)) === 'd0cf11e0a1b11ae1';
    }

    if ($extension === 'docx') {
        if (!class_exists('ZipArchive')) {
            return true;
        }

        $zip = new ZipArchive();
        if ($zip->open($tmpName) !== true) {
            return false;
        }

        $hasDocument = $zip->locateName('word/document.xml', ZipArchive::FL_NOCASE) !== false;
        $zip->close();

        return $hasDocument;
    }

    return false;
}

function dasitradeUploadedAttachment(string $fieldName): ?array
{
    if (!isset($_FILES[$fieldName]) || !is_array($_FILES[$fieldName])) {
        return null;
    }

    $file = $_FILES[$fieldName];
    $error = (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE);
    if ($error === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    if ($error !== UPLOAD_ERR_OK) {
        throw new UploadValidationException('Fisierul nu a putut fi incarcat.');
    }

    $size = (int) ($file['size'] ?? 0);
    if ($size <= 0 || $size > DASITRADE_MAX_UPLOAD_SIZE) {
        throw new UploadValidationException('Fisierul depaseste limita de 5 MB.');
    }

    $tmpName = (string) ($file['tmp_name'] ?? '');
    if ($tmpName === '' || !is_uploaded_file($tmpName)) {
        throw new UploadValidationException('Upload invalid.');
    }

    $originalName = (string) ($file['name'] ?? 'document');
    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    $allowed = [
        'pdf' => ['application/pdf'],
        'doc' => ['application/msword', 'application/octet-stream', 'application/CDFV2', 'application/vnd.ms-office', 'application/x-tika-msoffice'],
        'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream', 'application/x-tika-ooxml'],
    ];

    if (!isset($allowed[$extension])) {
        throw new UploadValidationException('Acceptam doar fisiere PDF, DOC sau DOCX.');
    }

    $mime = dasitradeUploadedMimeType($tmpName);
    if ($mime !== '' && !in_array($mime, $allowed[$extension], true)) {
        throw new UploadValidationException('Fisierul incarcat nu corespunde tipului declarat. Acceptam doar PDF, DOC sau DOCX valide.');
    }

    if (!dasitradeValidateAttachmentSignature($tmpName, $extension)) {
        throw new UploadValidationException('Fisierul incarcat nu are structura interna asteptata pentru tipul selectat.');
    }

    $safeName = preg_replace('/[^A-Za-z0-9._-]/', '-', basename($originalName)) ?? 'document.' . $extension;
    if ($safeName === '') {
        $safeName = 'document.' . $extension;
    }

    return [
        'tmp_name' => $tmpName,
        'name' => $safeName,
        'mime' => $allowed[$extension][0],
    ];
}
