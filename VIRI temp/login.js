const loginInput = document.querySelector('#login');
const passInput = document.querySelector('#pass');
const loginBtn = document.querySelector('#loginBtn');


fetch('../admin/database.json')
  .then(response => response.json())
  .catch(error => console.error('Помилка завантаження JSON:', error));


loginBtn.addEventListener('click', (event)=>{
    event.preventDefault();

    loginInputVal = loginInput.value.trim();
    passInputVal = passInput.value.trim();

    fetch('../admin/database.json')
    .then(response => response.json())
    .then(data => {
        if (loginInputVal == data.login && passInputVal == data.password){
            fetch("auth.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ authorization: true })
            });
            window.location.href = "/admin";
           
        }
        else{
            alert('Невірний логін або пароль!');
            loginInput.value = '';
            passInput.value = '';
        }

        

    })

    .catch(error => console.error('Помилка завантаження JSON:', error));

});
