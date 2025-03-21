document.querySelector(".login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const response = await fetch("/server/login.php", {
        method: "POST",
        body: formData
    });

    const result = await response.json();
    
    if (result.status === "success") {
        window.location.href = result.redirect;
    } else {
        alert(result.message);
    }
});
