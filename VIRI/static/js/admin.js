function delete_photo(photoName) {
    fetch('/delete-photo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ photo_name: photoName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload()
        } else {
            alert("Не вдалося видалити фото");
        }
    })
}

document.getElementById("upload-profile-pic").addEventListener("change", async function (event) {
    event.preventDefault(); 

    let fileInput = document.getElementById("upload-profile-pic").files[0];
    let formData = new FormData();
    formData.append("file", fileInput);

    let response = await fetch("/add-photo", {
        method: "POST",
        body: formData
    });

    let result = await response.text();
    location.reload();
});

