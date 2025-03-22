<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

$jsonFile = '../database.json';  // Шлях до JSON файлу

// Дозволяємо тільки POST-запити
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "❌ Доступ тільки через POST!"]);
    exit;
}

// Отримуємо дані з форми
$newLogin = $_POST['newLogin'] ?? null;
$newPassword = $_POST['newPassword'] ?? null;
$oldPassword = $_POST['oldPassword'] ?? null;

// Читаємо JSON-файл
if (!file_exists($jsonFile)) {
    echo json_encode(["status" => "error", "message" => "❌ Файл не знайдено!"]);
    exit;
}

$data = json_decode(file_get_contents($jsonFile), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "❌ Помилка читання JSON!"]);
    exit;
}

// Якщо змінюється логін
if ($newLogin) {
    $data['login'] = $newLogin;
}

// Якщо змінюється пароль, перевіряємо старий
if ($newPassword && $oldPassword) {
    if ($data['password'] === $oldPassword) {
        $data['password'] = $newPassword;
    } else {
        echo json_encode(["status" => "error", "message" => "❌ Невірний старий пароль!"]);
        exit;
    }
}

// Записуємо зміни у JSON
if (file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT))) {
    echo json_encode(["status" => "success", "message" => "✅ Дані оновлено!", "data" => $data]);
} else {
    echo json_encode(["status" => "error", "message" => "❌ Помилка запису у файл!"]);
}
?>
