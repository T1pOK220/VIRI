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
document.getElementById("upload-profile-pic").addEventListener("change", function(event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            Name = document.getElementById("profile-image").src = e.target.result;
            localStorage.setItem("profileImage", e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    let savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
        document.getElementById("profile-image").src = savedImage;
    }
});
function addPhoto(Name){
    fetch('/add-photo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ photo_name: Name })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload()
        } else {
            alert("Не вдалося завантажити фото");
        }
    }) }
