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
function addPhoto() {
    document.getElementById("upload-profile-pic").addEventListener("change", function(event) {
        let file = event.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function(e) {
                let photoURL = e.target.result;
                fetch('/add-photo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ photo_name: photoURL })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    } else {
                        alert("Не вдалося завантажити фото");
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    });
}
