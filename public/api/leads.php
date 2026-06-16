<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonResponse(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function cleanString(mixed $value): string
{
    if (!is_string($value)) {
        return '';
    }

    return trim($value);
}

function escapeTelegramHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function isValidBelarusPhone(string $value): bool
{
    return preg_match('/^\+375(?:25|29|33|44)\d{7}$/', $value) === 1;
}

function loadTelegramConfig(): array
{
    $config = [];
    $configFile = __DIR__ . '/telegram-config.php';

    if (is_file($configFile)) {
        $loaded = require $configFile;
        if (is_array($loaded)) {
            $config = $loaded;
        }
    }

    return [
        'bot_token' => trim((string) (getenv('TELEGRAM_BOT_TOKEN') ?: ($config['bot_token'] ?? ''))),
        'chat_id' => trim((string) (getenv('TELEGRAM_CHAT_ID') ?: ($config['chat_id'] ?? ''))),
        'thread_id' => trim((string) (getenv('TELEGRAM_THREAD_ID') ?: ($config['thread_id'] ?? ''))),
        'timezone' => trim((string) (getenv('LEADS_TIMEZONE') ?: ($config['timezone'] ?? 'Europe/Minsk')))
    ];
}

function parseChatIds(string $value): array
{
    $parts = preg_split('/[\s,;]+/', $value) ?: [];
    $chatIds = [];

    foreach ($parts as $part) {
        $chatId = trim($part);
        if ($chatId === '') {
            continue;
        }

        $chatIds[] = $chatId;
    }

    return array_values(array_unique($chatIds));
}

function loadEquipmentTitles(): array
{
    $equipmentFile = dirname(__DIR__) . '/data/equipment.json';
    if (!is_file($equipmentFile)) {
        return [];
    }

    $raw = file_get_contents($equipmentFile);
    if ($raw === false) {
        return [];
    }

    $items = json_decode($raw, true);
    if (!is_array($items)) {
        return [];
    }

    $titles = [];
    foreach ($items as $item) {
        if (!is_array($item) || empty($item['id']) || empty($item['title'])) {
            continue;
        }

        $titles[(string) $item['id']] = (string) $item['title'];
    }

    return $titles;
}

function formatLeadDate(string $timezone): string
{
    try {
        $date = new DateTimeImmutable('now', new DateTimeZone($timezone));
    } catch (Throwable) {
        $date = new DateTimeImmutable('now', new DateTimeZone('Europe/Minsk'));
    }

    return $date->format('d.m.Y H:i');
}

function buildTelegramMessage(array $lead, array $equipmentTitles, string $timezone): string
{
    $equipmentIds = array_values(array_filter(array_merge(
        [$lead['equipmentId'] ?? ''],
        is_array($lead['selectedEquipment'] ?? null) ? $lead['selectedEquipment'] : []
    )));

    $equipmentNames = [];
    foreach (array_unique($equipmentIds) as $equipmentId) {
        $equipmentNames[] = $equipmentTitles[$equipmentId] ?? (string) $equipmentId;
    }

    $lines = [
        '<b>Новая заявка с сайта</b>',
        '',
        '<b>Дата:</b> ' . escapeTelegramHtml(formatLeadDate($timezone)),
        '<b>Форма:</b> ' . escapeTelegramHtml((string) ($lead['formType'] ?? 'site-form')),
        '<b>Телефон:</b> ' . escapeTelegramHtml((string) $lead['phone']),
        '<b>Имя:</b> ' . escapeTelegramHtml((string) ($lead['name'] ?: 'Не указано')),
        '<b>Задача:</b> ' . escapeTelegramHtml((string) ($lead['task'] ?: 'Не указана')),
        '<b>Техника:</b> ' . escapeTelegramHtml($equipmentNames ? implode(', ', $equipmentNames) : 'Не выбрана'),
        '<b>Период:</b> ' . escapeTelegramHtml((string) ($lead['rentalPeriod'] ?: 'Не указан')),
        '<b>Адрес:</b> ' . escapeTelegramHtml((string) ($lead['address'] ?: 'Не указан')),
        '<b>Страница:</b> ' . escapeTelegramHtml((string) ($lead['sourcePage'] ?: '/'))
    ];

    $utm = $lead['utm'] ?? [];
    if (is_array($utm)) {
        $utmLines = [];
        foreach ($utm as $key => $value) {
            $key = cleanString($key);
            $value = cleanString((string) $value);
            if ($key === '' || $value === '') {
                continue;
            }

            $utmLines[] = escapeTelegramHtml($key) . ': ' . escapeTelegramHtml($value);
        }

        if ($utmLines) {
            $lines[] = '';
            $lines[] = '<b>UTM:</b>';
            array_push($lines, ...$utmLines);
        }
    }

    if (!empty($_SERVER['REMOTE_ADDR']) || !empty($_SERVER['HTTP_USER_AGENT'])) {
        $lines[] = '';
        $lines[] = '<b>Техническая информация:</b>';

        if (!empty($_SERVER['REMOTE_ADDR'])) {
            $lines[] = 'IP: ' . escapeTelegramHtml((string) $_SERVER['REMOTE_ADDR']);
        }

        if (!empty($_SERVER['HTTP_USER_AGENT'])) {
            $lines[] = 'User-Agent: ' . escapeTelegramHtml((string) $_SERVER['HTTP_USER_AGENT']);
        }
    }

    return implode("\n", $lines);
}

function postJson(string $url, array $payload): array
{
    $jsonPayload = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($jsonPayload === false) {
        throw new RuntimeException('Не удалось подготовить JSON payload');
    }

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS => $jsonPayload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15
        ]);

        $responseBody = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);

        if ($responseBody === false) {
            $error = curl_error($ch);
            curl_close($ch);
            throw new RuntimeException('Ошибка cURL: ' . $error);
        }

        curl_close($ch);
        return [$httpCode, $responseBody];
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $jsonPayload,
            'timeout' => 15
        ]
    ]);

    $responseBody = file_get_contents($url, false, $context);
    $statusLine = $http_response_header[0] ?? 'HTTP/1.1 500';
    preg_match('/\s(\d{3})\s/', $statusLine, $matches);
    $httpCode = isset($matches[1]) ? (int) $matches[1] : 500;

    if ($responseBody === false) {
        throw new RuntimeException('Не удалось выполнить HTTP-запрос к Telegram');
    }

    return [$httpCode, $responseBody];
}

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody ?: '', true);

if (!is_array($data)) {
    jsonResponse(400, ['success' => false, 'message' => 'Некорректный JSON']);
}

$lead = [
    'name' => cleanString($data['name'] ?? ''),
    'phone' => cleanString($data['phone'] ?? ''),
    'task' => cleanString($data['task'] ?? ''),
    'equipmentId' => cleanString($data['equipmentId'] ?? ''),
    'rentalPeriod' => cleanString($data['rentalPeriod'] ?? ''),
    'address' => cleanString($data['address'] ?? ''),
    'sourcePage' => cleanString($data['sourcePage'] ?? '/'),
    'selectedEquipment' => is_array($data['selectedEquipment'] ?? null) ? $data['selectedEquipment'] : [],
    'formType' => cleanString($data['formType'] ?? 'site-form'),
    'utm' => is_array($data['utm'] ?? null) ? $data['utm'] : []
];

if ($lead['phone'] === '' || !isValidBelarusPhone($lead['phone'])) {
    jsonResponse(400, ['success' => false, 'message' => 'Введите номер в формате +375291234567']);
}

if ($lead['task'] === '' && $lead['equipmentId'] === '') {
    jsonResponse(400, ['success' => false, 'message' => 'Опишите задачу или выберите технику']);
}

$config = loadTelegramConfig();
$chatIds = parseChatIds($config['chat_id']);
if ($config['bot_token'] === '' || !$chatIds) {
    jsonResponse(500, ['success' => false, 'message' => 'Telegram не настроен']);
}

try {
    $message = buildTelegramMessage($lead, loadEquipmentTitles(), $config['timezone']);
    $messageIds = [];

    foreach ($chatIds as $chatId) {
        $payload = [
            'chat_id' => $chatId,
            'text' => $message,
            'parse_mode' => 'HTML',
            'disable_web_page_preview' => true
        ];

        if ($config['thread_id'] !== '') {
            $payload['message_thread_id'] = (int) $config['thread_id'];
        }

        [$statusCode, $responseBody] = postJson(
            'https://api.telegram.org/bot' . rawurlencode($config['bot_token']) . '/sendMessage',
            $payload
        );

        $telegramResponse = json_decode($responseBody, true);
        if ($statusCode < 200 || $statusCode >= 300 || !is_array($telegramResponse) || empty($telegramResponse['ok'])) {
            $description = is_array($telegramResponse) && !empty($telegramResponse['description'])
                ? (string) $telegramResponse['description']
                : ('HTTP ' . $statusCode);

            jsonResponse(502, ['success' => false, 'message' => 'Не удалось отправить заявку: ' . $description]);
        }

        if (isset($telegramResponse['result']['message_id'])) {
            $messageIds[] = $telegramResponse['result']['message_id'];
        }
    }

    jsonResponse(200, [
        'success' => true,
        'telegramMessageId' => $messageIds[0] ?? null,
        'telegramMessageIds' => $messageIds
    ]);
} catch (Throwable $error) {
    jsonResponse(500, ['success' => false, 'message' => $error->getMessage()]);
}
