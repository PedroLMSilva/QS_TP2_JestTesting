
$(document).ready(()=>{
    resetLocalStorage();

    $("form").on("submit", function(event){
        event.stopPropagation();
        event.preventDefault();
        submitLogin();
    });

    if (getBrowser() === "chrome") {
        loginAjax("nunesd", "123456", (success)=>{
            if (!success) {
                showHideModalErrorMessage(true, "Username/password incorrecto.");
                return;
            }
            location.href = "/home.html";
        });
    }
    else
    {
        loginAjax("renatoreis", "123456", (success)=>{
            if (!success) {
                showHideModalErrorMessage(true, "Username/password incorrecto.");
                return;
            }
            location.href = "/home.html";
        });
    }
});

function submitLogin() {
    showHideModalErrorMessage(false);

    let login = $("#login").val();
    let password = $("#password").val();

    if (login === "") {
        showHideModalErrorMessage(true, "Username ou email obrigatório.");
        return;
    }

    if (password === "") {
        showHideModalErrorMessage(true, "Password obrigatória.");
        return;
    }

    loginAjax(login, password, (success)=>{
        if (!success) {
            showHideModalErrorMessage(true, "Username/password incorrecto.");
            return;
        }
        location.href = "/home.html";
    });
}

function loginAjax(login, password, callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";
    xhr.open("POST", "/api/login", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            SaveUserDetails(xhr.response);
            callback(true);
        }
        else if (this.readyState === 4) {
            console.log(this.status);
            console.log(this.statusText);
            callback(false);
        }
    };
    xhr.send(JSON.stringify({login: login, password: password}));
}


//============================================= HELPER FUNCTIONS
function showHideModalErrorMessage(show, message) { 
    let errorMessage = $("#formFooter");

    if (show) {
        errorMessage.text(message);
        errorMessage.show();
    }
    else
    {
        errorMessage.text("");
        errorMessage.hide();
    }
}
