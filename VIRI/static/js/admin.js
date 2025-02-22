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
