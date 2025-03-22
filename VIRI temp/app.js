document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    const uploadButton = document.getElementById("uploadButton");
    const imgBox = document.getElementById("imgBox");
    uploadButton.addEventListener("click", function () {
        fileInput.click();
    });
    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            uploadFile(fileInput.files[0]);
        }
    });

    function uploadFile(file) {
        const formData = new FormData();
        formData.append("file", file);

        fetch("admin/upload.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                addImageToDOM(data.filePath);
            } else {
                alert("Помилка: " + data.error);
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
        deleteBtn.dataset.path = src;

        imgContainer.appendChild(img);
        imgContainer.appendChild(deleteBtn);
        imgBox.appendChild(imgContainer);
    }

    // Делегування подій: обробляємо кліки на кнопки "Видалити"
    imgBox.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete")) {
            const imgContainer = event.target.parentElement;
            const filePath = event.target.dataset.path;
            deleteImage(imgContainer, filePath);
        }
    });

    function deleteImage(element, filePath) {
        fetch("admin/delete.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: filePath })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                element.remove();
            } else {
                alert("Помилка: " + data.error);
            }
        })
        .catch(error => console.error("Помилка:", error));
    }
});
