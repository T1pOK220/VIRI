<?php
session_start();
$db = new SQLite3('../users.db');

if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'Необхідно увійти в систему']);
    exit();
}

$email = $_SESSION['user'];
$oldPassword = $_POST['oldPassword'];
$newPassword = $_POST['newPassword'];

// Отримання хешу старого пароля
$stmt = $db->prepare('SELECT password FROM users WHERE email = :email');
$stmt->bindValue(':email', $email, SQLITE3_TEXT);
$result = $stmt->execute();
$user = $result->fetchArray(SQLITE3_ASSOC);

if (!$user || !password_verify($oldPassword, $user['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Старий пароль неправильний']);
    exit();
}

// Хешування нового пароля
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Оновлення пароля в базі даних
$updateStmt = $db->prepare('UPDATE users SET password = :newPassword WHERE email = :email');
$updateStmt->bindValue(':newPassword', $hashedPassword, SQLITE3_TEXT);
$updateStmt->bindValue(':email', $email, SQLITE3_TEXT);

if ($updateStmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Пароль успішно змінено']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Помилка при зміні пароля']);
}

$db->close();
?>
