<?php
declare(strict_types=1);

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
        'password' => 'Door_met12.',
        'auth' => true,
        'timeout' => 15,
        'options' => [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true,
            ],
        ],
    ],
];