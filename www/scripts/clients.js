"use strict";

var clientsArray = [];
var clientTable = null;


$(document).ready(()=> {
    $("#buttonNewClientSave").on("click", function(event){
        event.stopPropagation();
        event.preventDefault();
        createNewClientModalVerification();
    });

    $("#buttonNewClientOpenModel").on("click", function(event){
        event.stopPropagation();
        event.preventDefault();
        createNewClientModal();
    });

    $("#buttonEditClientDelete").on("click", function(event){
        event.stopPropagation();
        event.preventDefault();
        checkClientModalToDelete();
    });

    $("#buttonEditClientSave").on("click", function(event){
        event.stopPropagation();
        event.preventDefault();
        checkClientModalToSave();
    });

    $("#buttonDeleteClientCancel").on("click", function(event){
        event.stopPropagation();
        event.preventDefault();
        checkClientModalToDeleteButton(false);
    });

    $("#buttonDeleteClientConfirm").on("click", function(event){
        event.stopPropagation();
        event.preventDefault();
        checkClientModalToDeleteButton(true);
    });

    $(document).on("click", "#clientsTable tbody tr td:last-child i", function(e){
        e.preventDefault();
        e.stopPropagation();
        const clientId = parseInt($(this).attr("data-clientId"));
        openClientModalToEdit(clientId); 
    });

    loadAllClients();
});




function openClientModalToEdit(clientId){    
    const client = clientsArray.filter((c)=>{ return c.id === clientId; })[0];
    //console.log(client);
    let modal = $("#modalEditClients");
    modal.attr("data-id", clientId);

    modal.find("#inpEditName").val("");
    modal.find("#inpEditEmail").val("");
    modal.find("#inpEditAddress").val("");
    modal.find("#inpEditPostCode").val("");
    modal.find("#inpEditNif").val("");

    modal.find("#inpEditName").val(client.name);
    modal.find("#inpEditEmail").val(client.email);
    modal.find("#inpEditAddress").val(client.address);
    modal.find("#inpEditPostCode").val(client.postCode);
    modal.find("#inpEditNif").val(client.nif);

    showHideModalErrorMessage(modal, false);

    modal.modal("show");
}

function checkClientModalToSave() {
    let modal = $("#modalEditClients");    
    const clientId = parseInt(modal.attr("data-id"));

    showHideModalErrorMessage(modal, false);

    const client = new Client(
        clientId, 
        modal.find("#inpEditName").val(), 
        modal.find("#inpEditAddress").val(), 
        modal.find("#inpEditPostCode").val(), 
        modal.find("#inpEditEmail").val(),
        modal.find("#inpEditNif").val()
    );
    
    if (client.name === "") {
        showHideModalErrorMessage(modal, true, "O nome é obrigatório.");
        return;
    }

    if (client.email === "") {
        showHideModalErrorMessage(modal, true, "O email é obrigatório.");
        return;
    }

    if (!client.email.includes("@")) {
        showHideModalErrorMessage(modal, true, "O email não é valido.");
        return;
    }

    if (clientsArray.filter((c)=>{ return c.name.replace(" ", "").toUpperCase() === client.name.replace(" ", "").toUpperCase() && c.id !== clientId; }).length) {
        showHideModalErrorMessage(modal, true, "Este cliente já existe");
        return;
    }

    if (clientsArray.filter((c)=>{ return c.email.replace(" ", "").toUpperCase() === client.email.replace(" ", "").toUpperCase() && c.id !== clientId; }).length) {
        showHideModalErrorMessage(modal, true, "Um cliente com este email já existe");
        return;
    }

    editClientAjax(client, (status) => {
        if (!status) {
            showHideModalErrorMessage(modal, true, "Algo correu mal. Tente outravez.");
            return;
        }
        loadAllClients();
        modal.modal("hide");
    });
}

function checkClientModalToDelete(){
    let modalEdit = $("#modalEditClients");    
    const clientId = parseInt(modalEdit.attr("data-id"));

    modalEdit.on('hidden.bs.modal', function (e) {
        $(this).off('hidden.bs.modal');
        let modalMessage = $("#modalMessage");
        modalMessage.find(".modal-body p").text("Tem a certeza que quer remover este cliente?");
        modalMessage.attr("data-id", clientId);
        modalMessage.modal("show");
    });
    modalEdit.modal("hide");
}

function checkClientModalToDeleteButton(toDelete){
    let modalMessage = $("#modalMessage");
    let modalEdit = $("#modalEditClients"); 
    const clientId = parseInt(modalMessage.attr("data-id"));

    showHideModalErrorMessage(modalEdit, false);

    if (!toDelete) {
        modalMessage.on('hidden.bs.modal', function (e) {
            $(this).off('hidden.bs.modal');
            modalEdit.modal("show");
        });
        modalMessage.modal("hide");
        return;
    }

    deleteClientAjax(clientId, (success)=>{
        if (!success) {
            modalMessage.on('hidden.bs.modal', function (e) {
                $(this).off('hidden.bs.modal');
                showHideModalErrorMessage(modalEdit, true, "Algo correu mal. Tente outravez.");
                modalEdit.modal("show");
            });
            modalMessage.modal("hide");
            return;
        }

        loadAllClients()
        modalMessage.modal("hide");
    });
}

function createNewClientModal(){
    let modal = $("#modalCreateClients");
    modal.find("#inpCreateName").val("");
    modal.find("#inpCreateEmail").val("");
    modal.find("#inpCreateAddress").val("");
    modal.find("#inpCreatePostCode").val("");
    modal.find("#inpCreateNif").val("");
    showHideModalErrorMessage(modal, false);
    modal.modal("show");
}

function createNewClientModalVerification(){
    let modal = $("#modalCreateClients");

    const client = new Client(
        null, 
        modal.find("#inpCreateName").val(), 
        modal.find("#inpCreateAddress").val(), 
        modal.find("#inpCreatePostCode").val(), 
        modal.find("#inpCreateEmail").val(),
        modal.find("#inpCreateNif").val()
    );

    showHideModalErrorMessage(modal, false);

    if (client.name === "") {
        showHideModalErrorMessage(modal, true, "O nome é obrigatório.");
        return;
    }

    if (client.email === "") {
        showHideModalErrorMessage(modal, true, "O email é obrigatório.");
        return;
    }

    if (!client.email.includes("@")) {
        showHideModalErrorMessage(modal, true, "O email não é valido.");
        return;
    }

    if (clientsArray.filter((c)=>{ return c.name.replace(" ", "").toUpperCase() === client.name.replace(" ", "").toUpperCase(); }).length) {
        showHideModalErrorMessage(modal, true, "Este cliente já existe");
        return;
    }

    if (clientsArray.filter((c)=>{ return c.email.replace(" ", "").toUpperCase() === client.email.replace(" ", "").toUpperCase(); }).length) {
        showHideModalErrorMessage(modal, true, "Um cliente com este email já existe");
        return;
    }

    createClientAjax(client, (success)=>{
        if (!success) {
            showHideModalErrorMessage(modal, true, "Algo correu mal. Tente outravez.");
            return;
        }
        loadAllClients();
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

function loadAllClients() {
    let table = $("#clientsTable"); 

    getClientsAjax((clients)=>{
        clientsArray = clients;
        
        if (clientTable) {
            clientsArray = clients;
            clientTable.clear().draw();
            clientTable.rows.add(clientsArray); 
            clientTable.columns.adjust().draw(); 
            return;
        }

        clientTable = table.DataTable({
            data: clients,
            language: {
                lengthMenu: "Mostrar _MENU_ clientes",
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
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
            columnDefs: [
                { targets: 3, className: "text-center" },
                { targets: 4, className: "text-center tableJobTdIcon", width: "20px" },
                { orderable: false, targets: [2, 3, 4] }
            ],
            fnRowCallback: function(row) {
                $(row).attr("scope", "row");     
            },
            columns: [
                { data: 'name' },
                { data: 'email' },
                { data: 'nif' },
                { data: null, render : function (data, type, _, __) {
                    if (type === "display") {
                        if (data.TOTAL_JOBS === 0 && data.TOTAL_JOBS_FINALISED === 0) {
                            return "0";
                        }
                        
                        let status = data.TOTAL_JOBS_FINALISED === 1 ? "1 finalisado em " : (data.TOTAL_JOBS_FINALISED + " finalisados em ");
                        status += data.TOTAL_JOBS;
                        return status;
                    } 
                    else 
                    {
                        return data;
                    }
                  }
                },
                { data: null, render : function (data, type, _, __) {
                    if (type === "display") {
                        return `<i class="fas fa-edit table-client-icon-edit" data-clientId="${data.id}"></i>`;
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


//============================================= AJAX CALLS
function getClientsAjax(callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";
    xhr.open("GET", "/api/getClients", true);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const { clients } = xhr.response;
            saveClientsLocalStorage(clients);
            callback(clients);
        }
        else if (this.readyState === 4) {
            console.log(this.status);
            console.log(this.statusText);

            const clients = getClientsLocalStorage();
            callback(clients);
        }
    };
    xhr.send();
}

function editClientAjax(client, callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";    
    xhr.open("PUT", "/api/editClient", true);
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
    xhr.send(JSON.stringify(client));
}

function deleteClientAjax(id, callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";    
    xhr.open("DELETE", `/api/deleteClient/${id}`, true);
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

function createClientAjax(client, callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";    
    xhr.open("POST", "/api/createClient", true);
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
    xhr.send(JSON.stringify(client));
}

