<?php
$data = json_decode(file_get_contents("php://input"), true);
if (!empty($data["filePath"])) {
    if (unlink($data["filePath"])) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}
?>
