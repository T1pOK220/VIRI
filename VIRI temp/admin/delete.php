<?php
$data = json_decode(file_get_contents("php://input"), true);
$filePath = $data["path"] ?? null;

if ($filePath && file_exists($filePath)) {
    if (unlink($filePath)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Не вдалося видалити файл"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Файл не знайдено"]);
}
?>
