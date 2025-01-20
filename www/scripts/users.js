"use strict";

var usersArray = [];
var usersTable = null;
var pageSettings;

$(document).ready(()=> {
    $("#buttonNewUserOpenModel").on("click", function(event){
        event.stopPropagation();
        event.preventDefault();
        createNewUserModal();
    });

    $("#buttonNewUserSave").on("click", function(event){
        event.stopPropagation();
        event.preventDefault();
        createNewUserModalVerification();
    });

    $("#buttonEditUserDelete").on("click", function(event){
        event.stopPropagation();
        event.preventDefault();
        checkUserModalToDelete();
    });

    $("#buttonDeleteUserCancel").on("click", function(event){
        event.stopPropagation();
        event.preventDefault();
        checkUserModalToDeleteButton(false);
    });

    $("#buttonDeleteUserConfirm").on("click", function(event){
        event.stopPropagation();
        event.preventDefault();
        checkUserModalToDeleteButton(true);
    });

    $("#buttonEditUserSave").on("click", function(event){
        event.stopPropagation();
        event.preventDefault();
        checkUserModalToSave();
    });

    $(document).on("click", "#usersTable tbody tr td:last-child i", function(e){
        e.preventDefault();
        e.stopPropagation();
        const userId = parseInt($(this).attr("data-userId"));
        openUserModalToEdit(userId); 
    });

    loadAllUsers();
    loadPageSettings();
});


function loadAllUsers() {
    let table = $("#usersTable"); 

    getUsersAjax((users)=>{
        usersArray = users;

        if (usersTable) {
            usersArray = users;
            usersTable.clear().draw();
            usersTable.rows.add(usersArray); 
            usersTable.columns.adjust().draw(); 
            return;
        }

        usersTable = table.DataTable({
            data: users,
            language: {
                lengthMenu: "Mostrar _MENU_ utilizadores",
                search: `Procurar: <i class="fas fa-search"></i>`,
                info: "Página _START_ de _END_",
                paginate: {
                    'previous': '<span class="prev-icon">Anterior</span>',
                    'next': '<span class="next-icon">Seguinte</span>'
                }
            },
            searching: true,
		    info: true,
            paging: true,
            order: [],
            fnRowCallback: function(row) {
                $(row).attr("scope", "row");     
            },
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
            columnDefs: [
                { targets: 4, width: "70px", className: "text-center" },
                { targets: 5, className: "text-center tableJobTdIcon", width: "20px" },
                { orderable: false, targets: [2, 3, 4, 5] }
            ],
            columns: [
                { data: 'name' },
                { data: 'userName' },
                { data: 'email' },
                { data: 'roleDescription' },
                { data: 'TOTAL_JOBS' },
                { data: null, render : function (data, type, _, __) {
                    if (type === "display") {
                        if (userDetails.id === data.id) {
                            return "";
                        }
                        
                        return `<i class="fas fa-edit table-users-icon-edit" data-userId="${data.id}"></i>`;
                    } 
                    else 
                    {
                        return data;
                    }
                  }
                }
            ]
        });
    });
}

function loadPageSettings(){    
    loadPageSettingsAjax((settings)=>{
        pageSettings = settings;
        //console.log(pageSettings);
        let inpEditUserType = $("#inpEditUserType");
        let inpUserType = $("#inpUserType");

        pageSettings[0].forEach((code)=>{
            inpEditUserType.append(`<option value='${code.code}'>${code.description}</option>`);
            inpUserType.append(`<option value='${code.code}'>${code.description}</option>`);
        });
    });
}

function createNewUserModal(){
    let modal = $("#modalCreateUser");
    modal.find("#inpCreateName").val("");
    modal.find("#inpCreateUserName").val("");
    modal.find("#inpCreateEmail").val("");
    modal.find("#inpUserType").val("");
    modal.find("#inpPassword").val("");
    modal.find("#inpConfirmPassword").val("");
    showHideModalErrorMessage(modal, false);
    modal.modal("show");
}

function createNewUserModalVerification(){
    let modal = $("#modalCreateUser");

    let name = modal.find("#inpCreateName").val();
    let userName = modal.find("#inpCreateUserName").val();
    let email = modal.find("#inpCreateEmail").val();
    let role = modal.find("#inpUserType").val();
    let password = modal.find("#inpPassword").val();
    let confirmPassword = modal.find("#inpConfirmPassword").val();

    showHideModalErrorMessage(modal, false);

    if (name === "") {
        showHideModalErrorMessage(modal, true, "O nome é obrigatório.");
        return;
    }
    if (userName === "") {
        showHideModalErrorMessage(modal, true, "O nome de utilizador é obrigatório.");
        return;
    }
    if (email === "") {
        showHideModalErrorMessage(modal, true, "O email é obrigatório.");
        return;
    }

    if (!email.includes("@")) {
        showHideModalErrorMessage(modal, true, "O email não é valido.");
        return;
    }

    if (usersArray.filter((u)=>{ return u.userName.replace(" ", "").toUpperCase() === userName.replace(" ", "").toUpperCase(); }).length) {
        showHideModalErrorMessage(modal, true, "Este utilizador já existe");
        return;
    }

    if (usersArray.filter((u)=>{ return u.email.replace(" ", "").toUpperCase() === email.replace(" ", "").toUpperCase(); }).length) {
        showHideModalErrorMessage(modal, true, "Um utilizador com este email já existe");
        return;
    }

    if (role === null) {
        showHideModalErrorMessage(modal, true, "Seleccione o tipo de utilizador.");
        return;
    }

    if (password === "") {
        showHideModalErrorMessage(modal, true, "Introduza password.");
        return;
    }
    if (confirmPassword === "") {
        showHideModalErrorMessage(modal, true, "Confirme password.");
        return;
    }
    if(!(password === confirmPassword)) {
        showHideModalErrorMessage(modal, true, "As passwords não correspondem.");
        return;
    }

    const user = new User(
        null, 
        userName, 
        name, 
        email, 
        role,
        confirmPassword
    );

    createUserAjax(user, (success)=>{
        if (!success) {
            showHideModalErrorMessage(modal, true, "Algo correu mal. Tente outravez.");
            return;
        }
        loadAllUsers();
        modal.modal("hide");
    });
}

function openUserModalToEdit(userId){    
    const user = usersArray.filter((u)=>{ return u.id === userId; })[0];
    //console.log(user);
    let modal = $("#modalEditUser");
    modal.attr("data-id", userId);

    modal.find("#inpEditName").val("");
    modal.find("#inpEditUserName").val("");
    modal.find("#inpEditEmail").val("");
    modal.find("#inpEditUserType").val("");

    modal.find("#inpEditName").val(user.name);
    modal.find("#inpEditUserName").val(user.userName);
    modal.find("#inpEditEmail").val(user.email);
    modal.find(`#inpEditUserType option[value='${user.roleCode}']`).prop('selected', true);

    showHideModalErrorMessage(modal, false);

    modal.modal("show");
}

function checkUserModalToDelete(){
    let modalEdit = $("#modalEditUser");    
    const userId = parseInt(modalEdit.attr("data-id"));

    modalEdit.on('hidden.bs.modal', function (e) {
        $(this).off('hidden.bs.modal');
        let modalMessage = $("#modalMessage");
        modalMessage.find(".modal-body p").text("Tem a certeza que quer remover este utilizador?");
        modalMessage.attr("data-id", userId);
        modalMessage.modal("show");
    });
    modalEdit.modal("hide");
}

function checkUserModalToDeleteButton(toDelete){
    let modalMessage = $("#modalMessage");
    let modalEdit = $("#modalEditUser"); 
    const userId = parseInt(modalMessage.attr("data-id"));

    showHideModalErrorMessage(modalEdit, false);

    if (!toDelete) {
        modalMessage.on('hidden.bs.modal', function (e) {
            $(this).off('hidden.bs.modal');
            modalEdit.modal("show");
        });
        modalMessage.modal("hide");
        return;
    }

    deleteUserAjax(userId, (success)=>{
        if (!success) {
            modalMessage.on('hidden.bs.modal', function (e) {
                $(this).off('hidden.bs.modal');
                showHideModalErrorMessage(modalEdit, true, "Algo correu mal. Tente outravez.");
                modalEdit.modal("show");
            });
            modalMessage.modal("hide");
            return;
        }

        loadAllUsers();
        modalMessage.modal("hide");
    });
}

function checkUserModalToSave() {
    let modal = $("#modalEditUser");    
    const userId = parseInt(modal.attr("data-id"));

    showHideModalErrorMessage(modal, false);

    let name = modal.find("#inpEditName").val();
    let userName = modal.find("#inpEditUserName").val();
    let email = modal.find("#inpEditEmail").val();
    let role = modal.find("#inpEditUserType").val();

   
    if (name === "") {
        showHideModalErrorMessage(modal, true, "O nome é obrigatório.");
        return;
    }
    if (email === "") {
        showHideModalErrorMessage(modal, true, "O email é obrigatório.");
        return;
    }

    if (!email.includes("@")) {
        showHideModalErrorMessage(modal, true, "O email não é valido.");
        return;
    }
    if (usersArray.filter((u)=>{ return u.email.replace(" ", "").toUpperCase() === email.replace(" ", "").toUpperCase() && u.id !== userId; }).length) {
        showHideModalErrorMessage(modal, true, "Um utilizador com este email já existe");
        return;
    }

    const user = new User(
        userId, 
        userName, 
        name, 
        email, 
        role,
        null
    );

    editUserAjax(user, (status) => {
        if (!status) {
            showHideModalErrorMessage(modal, true, "Algo correu mal. Tente outravez.");
            return;
        }
        loadAllUsers();

        modal.modal("hide");
    });
}


//============================================= HELPER FUNCTIONS
function showHideModalErrorMessage(modal, show, message) { 
    let errorMessage = modal.find(".errorDivMessage");

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


//============================================= AJAX CALLS
function getUsersAjax(callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";
    xhr.open("GET", "/api/getUsers", true);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const { users } = xhr.response;
            saveUsersLocalStorage(users);
            callback(users);
        }
        else if (this.readyState === 4) {
            console.log(this.status);
            console.log(this.statusText);

            const users = getUsersLocalStorage();
            callback(users);
        }
    };
    xhr.send();
}

function createUserAjax(user, callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";    
    xhr.open("POST", "/api/createUser", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(true);
        }
        else if (this.readyState === 4) {
            console.log(this.status);
            console.log(this.statusText);
            callback(false);
        }
    };
    xhr.send(JSON.stringify(user));
}

function deleteUserAjax(id, callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";    
    xhr.open("DELETE", `/api/deleteUser/${id}`, true);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(true);
        }
        else if (this.readyState === 4) {
            console.log(this.status);
            console.log(this.statusText);
            callback(false);
        }
    };
    xhr.send();
}

function editUserAjax(user, callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";    
    xhr.open("PUT", "/api/editUser", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(xhr.response.success);
        }
        else if (this.readyState === 4) {
            console.log(this.status);
            console.log(this.statusText);
            callback(false);
        }
    };
    xhr.send(JSON.stringify(user));
}

function loadPageSettingsAjax(callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";
    xhr.open("GET", "/api/getPageSettings", true);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(xhr.response.pageSettings);
        }
        else if (this.readyState === 4) {
            console.log(this.status);
            console.log(this.statusText);
            callback([]);
        }
    };
    xhr.send();
}