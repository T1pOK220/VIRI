<?php
session_start();

// Підключення до бази даних SQLite
$db = new SQLite3('../users.db');

// Отримання даних з POST-запиту
$email = $_POST['username'];
$password = $_POST['password'];

// Пошук користувача в базі даних
$stmt = $db->prepare('SELECT password FROM users WHERE email = :email');
$stmt->bindValue(':email', $email, SQLITE3_TEXT);
$result = $stmt->execute();

$user = $result->fetchArray(SQLITE3_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    $_SESSION['user'] = $email;
    echo json_encode(['status' => 'success', 'redirect' => '/dashboard.html']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Невірний логін або пароль']);
}

$db->close();
?>
