document.addEventListener("DOMContentLoaded", function () {
    const formLog = document.querySelector('form:nth-child(1)');
    const formPass = document.querySelector('form:nth-child(2)');

    function sendData(body) {
        fetch("../../admin/admin-profile/update.php", {
            method: "POST",  // Використовуємо POST запит
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body  // Тіло запиту
        })
        .then(response => response.text())  // Отримуємо відповідь як текст
        .then(text => {
            console.log("🔍 Отримана відповідь від сервера:", text); // Лог у консоль
            return JSON.parse(text); // Парсимо JSON
        })
        .then(data => alert(data.message))
        .catch(error => console.error("❌ JSON помилка:", error));
    }

    formLog.addEventListener('submit', function (e) {
        e.preventDefault();  // Перехоплюємо стандартну відправку форми
        const inputLog = document.querySelector("#inputLog").value.trim();
        sendData(`newLogin=${encodeURIComponent(inputLog)}`);
    });

    formPass.addEventListener('submit', function (e) {
        e.preventDefault();  // Перехоплюємо стандартну відправку форми
        const inputNewPass = document.querySelector("#inputNewPass").value.trim();
        const inputOldPass = document.querySelector("#inputOldPass").value.trim();
        sendData(`newPassword=${encodeURIComponent(inputNewPass)}&oldPassword=${encodeURIComponent(inputOldPass)}`);
    });
});
