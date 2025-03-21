document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const action = this.getAttribute("action");

        const response = await fetch(action, {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        alert(result.message);
    });
});
