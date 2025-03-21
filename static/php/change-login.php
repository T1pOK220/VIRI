<?php
session_start();
$db = new SQLite3('../users.db');

if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'Необхідно увійти в систему']);
    exit();
}

$oldEmail = $_SESSION['user'];
$newEmail = $_POST['newLogin'];

// Перевірка чи новий email не зайнятий
$checkStmt = $db->prepare('SELECT id FROM users WHERE email = :newEmail');
$checkStmt->bindValue(':newEmail', $newEmail, SQLITE3_TEXT);
$checkResult = $checkStmt->execute()->fetchArray();

if ($checkResult) {
    echo json_encode(['status' => 'error', 'message' => 'Цей логін вже зайнятий']);
    exit();
}

// Оновлення email
$stmt = $db->prepare('UPDATE users SET email = :newEmail WHERE email = :oldEmail');
$stmt->bindValue(':newEmail', $newEmail, SQLITE3_TEXT);
$stmt->bindValue(':oldEmail', $oldEmail, SQLITE3_TEXT);

if ($stmt->execute()) {
    $_SESSION['user'] = $newEmail;
    echo json_encode(['status' => 'success', 'message' => 'Логін успішно змінено']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Помилка при зміні логіна']);
}

$db->close();
?>
