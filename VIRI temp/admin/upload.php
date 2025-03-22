<?php
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_FILES["file"])) {
    $uploadDir = "../imgs/project-images/";
    $fileName = time() . "_" . basename($_FILES["file"]["name"]);
    $uploadFile = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $uploadFile)) {
        echo json_encode(["success" => true, "filePath" => $uploadFile]);
    } else {
        echo json_encode(["success" => false, "error" => "Не вдалося завантажити файл"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Файл не отримано"]);
}
?>
