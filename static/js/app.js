document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("upload-profile-pic");
    const imgBox = document.querySelector(".img-box");

    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file && file.type.startsWith("image/")) {
            uploadFile(file);
        } else {
            alert("Будь ласка, виберіть зображення!");
        }
    });

    function uploadFile(file) {
        const formData = new FormData();
        formData.append("file", file);

        fetch("upload.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                addImageToDOM(data.filePath);
            } else {
                alert("Помилка завантаження файлу!");
            }
        })
        .catch(error => console.error("Помилка:", error));
    }

    function addImageToDOM(src) {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("img-container");

        const img = document.createElement("img");
        img.src = src;
        img.classList.add("img");

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete");
        deleteBtn.innerText = "Видалити фото";
        deleteBtn.addEventListener("click", function () {
            deleteImage(imgContainer, src);
        });

        imgContainer.appendChild(img);
        imgContainer.appendChild(deleteBtn);
        imgBox.appendChild(imgContainer);
    }

    function deleteImage(element, src) {
        fetch("delete.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filePath: src })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                element.remove();
            } else {
                alert("Помилка видалення файлу!");
            }
        })
        .catch(error => console.error("Помилка:", error));
    }

    document.querySelectorAll(".delete").forEach(button => {
        button.addEventListener("click", function () {
            const imgContainer = button.parentElement;
            const img = imgContainer.querySelector("img");
            deleteImage(imgContainer, img.src);
        });
    });
});
