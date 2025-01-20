"use strict";

var jobsArray = [];
var tableJobs;
var initPageState;

$(document).ready(()=> {
    $("#btnNewService").on("click", function(event) {
        event.stopPropagation();
        event.preventDefault();
        openNewServiceModal();
    });

    $(".newServiceContainerOuterBodyFooter .btnClose").on("click", function(event) {
        event.stopPropagation();
        event.preventDefault();
        $("#newServiceContainer").hide();
    });

    $(".newServiceContainerOuterBodyFooter .btnSave").on("click", function(event) {
        event.stopPropagation();
        event.preventDefault();
        saveJobInformation();
    });
    
    $(".newCreateServiceContainerOuterBodyFooter .btnClose").on("click", function(event) {
        event.stopPropagation();
        event.preventDefault();
        $("#newCreateServiceContainer").hide();
    });

    $(".newCreateServiceContainerOuterBodyFooter .btnSave").on("click", function(event) {
        event.stopPropagation();
        event.preventDefault();
        createJobInformation();
    });

    $("#inputEquipmentType").on("change", function(event) {
        event.stopPropagation();
        event.preventDefault();

        let option = $(this).val();

        let dropEquipmentTypeTextarea = $("#textareaEquipmentType");
        let dropEquipmentTypeTextareaContent = dropEquipmentTypeTextarea.parent();

        dropEquipmentTypeTextarea.val("");

        if (option === "100") {          
            dropEquipmentTypeTextareaContent.removeClass("textareaEquipmentTypeDescription");
            return;
        }

        dropEquipmentTypeTextareaContent.addClass("textareaEquipmentTypeDescription");
    });

    $("#inputEquipmentType1").on("change", function(event) {
        event.stopPropagation();
        event.preventDefault();

        let option = $(this).val();

        let dropEquipmentTypeTextarea = $("#textareaEquipmentType1");
        let dropEquipmentTypeTextareaContent = dropEquipmentTypeTextarea.parent();

        dropEquipmentTypeTextarea.val("");

        if (option === "100") {          
            dropEquipmentTypeTextareaContent.removeClass("textareaEquipmentTypeDescription1");
            return;
        }

        dropEquipmentTypeTextareaContent.addClass("textareaEquipmentTypeDescription1");
    });

    $("#inputEquipmentProcedure").on("change", function(event) {
        event.stopPropagation();
        event.preventDefault();

        let option = $(this).val();

        let dropEquipmentProcedureTextarea = $("#textareaEquipmentProcedure");
        let dropEquipmentProcedureTextareaContent = dropEquipmentProcedureTextarea.parent();

        dropEquipmentProcedureTextarea.val("");

        if (option === "100") {          
            dropEquipmentProcedureTextareaContent.removeClass("textareaEquipmentProcedureDescription");
            return;
        }

        dropEquipmentProcedureTextareaContent.addClass("textareaEquipmentProcedureDescription");
    });

    $("#inputEquipmentProcedure1").on("change", function(event) {
        event.stopPropagation();
        event.preventDefault();

        let option = $(this).val();

        let dropEquipmentProcedureTextarea = $("#textareaEquipmentProcedure1");
        let dropEquipmentProcedureTextareaContent = dropEquipmentProcedureTextarea.parent();

        dropEquipmentProcedureTextarea.val("");

        if (option === "100") {          
            dropEquipmentProcedureTextareaContent.removeClass("textareaEquipmentProcedureDescription1");
            return;
        }

        dropEquipmentProcedureTextareaContent.addClass("textareaEquipmentProcedureDescription1");
    });

    $("#dropDownTypeJobList").on("change", function(event) {
        event.stopPropagation();
        event.preventDefault();
        loadListJobs();
    });

    $(".newServiceContainerOuterBodyFooter .btnReopen").on("click", function(event) {
        event.stopPropagation();
        event.preventDefault();
        reopenJobAjax($(this).attr("data-id"), (success)=>{
            if (!success) {
                alert("Algo correu mal. tente outravez.");
                return;
            }
            $("#inputEquipmentType").removeAttr("disabled");
            $("#inputEquipmentBrand").removeAttr("disabled");
            $("#textareaEquipmentType").removeAttr("disabled");
            $("#inputEquipmentProcedure").removeAttr("disabled");
            $("#textareaEquipmentProcedure").removeAttr("disabled");
            $("#textareaJobNotes").removeAttr("disabled");
        
            let editJobStatus = $("#inputJobStatus");
            editJobStatus.removeAttr("disabled");
            editJobStatus.find(`option[value='1']`).prop("selected", true);

            let divInfoFinalised = $(".editJobFinalisedDiv");
            divInfoFinalised.find(".alert").html("");
            divInfoFinalised.hide();

            $(".newServiceContainerOuterBodyFooter .btnReopen").hide();

            loadListJobs();
     
        });
    });
    
    $(document).on("dragstart", ".jobEditCardDetailsPriority .card-body-body .badge", function(event) {  
        event.originalEvent.dataTransfer.effectAllowed = "move";
        event.originalEvent.dataTransfer.setData("code", $(event.target).attr("data-code"));
    });

    $(document).on("dragover", ".jobEditCardDetailsPriority .card-body-header", function(event) {  
        event.stopPropagation();
        event.preventDefault();
    })
    .on("dragleave", ".jobEditCardDetailsPriority .card-body-header", function(event) { 
        event.stopPropagation();
        event.preventDefault();
    })
    .on("drop", ".jobEditCardDetailsPriority .card-body-header", function(event) { 
        const code = event.originalEvent.dataTransfer.getData("code");
        setPriorityCard(code, "jobEditCardDetailsPriority");
    });

    $(document).on("dragstart", ".jobCreateCardDetailsPriority .card-body-body .badge", function(event) {  
        event.originalEvent.dataTransfer.effectAllowed = "move";
        event.originalEvent.dataTransfer.setData("code", $(event.target).attr("data-code"));
    });

    $(document).on("dragover", ".jobCreateCardDetailsPriority .card-body-header", function(event) {  
        event.stopPropagation();
        event.preventDefault();
    })
    .on("dragleave", ".jobCreateCardDetailsPriority .card-body-header", function(event) { 
        event.stopPropagation();
        event.preventDefault();
    })
    .on("drop", ".jobCreateCardDetailsPriority .card-body-header", function(event) { 
        const code = event.originalEvent.dataTransfer.getData("code");
        setPriorityCard(code, "jobCreateCardDetailsPriority");
    });


    $(document).on("dragstart", "#jobsTable tbody tr", function(event) {  
        event.originalEvent.dataTransfer.effectAllowed = "move";
        event.originalEvent.dataTransfer.setData("rowInfo", $(event.target).attr("data-rowinfo"));
    });
    
    $(document).on("dragover", "#jobsTable tbody tr", function(event) {  
        event.stopPropagation();
        event.preventDefault();
    })
    .on("dragleave", "#jobsTable tbody tr", function(event) { 
        event.stopPropagation();
        event.preventDefault();
    })
    .on("drop", "#jobsTable tbody tr", function(event) { 
        const startRowInfo = JSON.parse(event.originalEvent.dataTransfer.getData("rowInfo"));
        let endRowInfo = $(event.target);
        if (endRowInfo[0].tagName === "TD") {
            endRowInfo = endRowInfo.parent();
        }
        else if (endRowInfo[0].tagName === "SPAN" || endRowInfo[0].tagName === "I"|| endRowInfo[0].tagName === "SMALL") {
            endRowInfo = endRowInfo.parent().parent();
        }
        else if (endRowInfo[0].tagName === "B") {
            endRowInfo = endRowInfo.parent().parent().parent();
        }

        endRowInfo = JSON.parse(endRowInfo.attr("data-rowinfo"));

        if (startRowInfo.priority !== endRowInfo.priority) {
            return;
        }

        editOrderPriority(startRowInfo, endRowInfo, (success)=>{
            if (!success) {
                return;
            }
            loadListJobs();
        })
        
    });

    getInformationTobuildInitialPageStateAjax(()=>{
        buildInitialPageState();
        loadListJobs();
    });

    $(document).on("click", "#jobsTable tbody tr td:last-child i", function(e){
        e.preventDefault();
        e.stopPropagation();
        const jobId = parseInt($(this).attr("data-jobid"));
        editJobOpenModal(jobId); 
    });

});

function buildInitialPageState(){
    if (initPageState === 0) {
        return;
    }

    //console.log(initPageState);
    let dropEquipmentType = $("#inputEquipmentType");
    let dropEquipmentType2 = $("#inputEquipmentType1");
    initPageState[1].forEach((jobEquipment)=>{
        dropEquipmentType.append(`<option value='${jobEquipment.code}'>${jobEquipment.description}</option>`);
        dropEquipmentType2.append(`<option value='${jobEquipment.code}'>${jobEquipment.description}</option>`);
    });

    let dropEquipmentBrand = $("#inputEquipmentBrand");
    let dropEquipmentBrand2= $("#inputEquipmentBrand1");
    initPageState[3].forEach((brand)=>{
        dropEquipmentBrand.append(`<option value='${brand.code}'>${brand.description}</option>`);
        dropEquipmentBrand2.append(`<option value='${brand.code}'>${brand.description}</option>`);
    });

    let dropEquipmentProcedure = $("#inputEquipmentProcedure");
    let dropEquipmentProcedure2 = $("#inputEquipmentProcedure1");
    initPageState[2].forEach((jobEquipment)=>{
        dropEquipmentProcedure.append(`<option value='${jobEquipment.code}'>${jobEquipment.description}</option>`);
        dropEquipmentProcedure2.append(`<option value='${jobEquipment.code}'>${jobEquipment.description}</option>`);
    });

    let editJobStatus = $("#inputJobStatus");
    let editJobStatus2 = $("#inputJobStatus1");
    initPageState[0].forEach((status)=>{
        editJobStatus.append(`<option value='${status.code}'>${status.description}</option>`);
        editJobStatus2.append(`<option value='${status.code}'>${status.description}</option>`);
    });

    let dropDownTypeJobList = $("#dropDownTypeJobList");
    let tempList = [
        { code: "ME", description: "Mostrar os meus trabalhos"},
        { code: "ALL", description: "Mostrar todos os trabalhos"}
    ];
    tempList.forEach((status)=>{
        dropDownTypeJobList.append(`<option value='${status.code}'>${status.description}</option>`);
    });

    initPageState[0].forEach((status)=>{
        dropDownTypeJobList.append(`<option value='${status.code}'>${status.description}</option>`);
    });

    let dropCreateClient = $("#dropCreateClient");
    [{ID: 0, NAME: "Selecionar cliente"}].forEach((client)=>{
        dropCreateClient.append(`<option value='${client.ID}'>${client.NAME}</option>`);
    });
    initPageState[4].forEach((client)=>{
        dropCreateClient.append(`<option value='${client.ID}'>${client.NAME}</option>`);
    });
}

function loadListJobs() {
    getListJobsAjax(getCurrentTypeStatusJobScreen(), (jobs)=>{
        jobsArray = jobs;
        //console.log(jobsArray);
        createTable(jobsArray);
    });
}

function createTable(jobs) {
    let table = $("#jobsTable");

    if (tableJobs) {
        tableJobs.clear().draw();
        tableJobs.rows.add(jobs); 
        tableJobs.columns.adjust().draw(); 
        return;
    }

    tableJobs = table.DataTable({
        data: jobs,
        language: {
            lengthMenu: "Mostrar _MENU_ serviços",
            search: `Procurar: <i class="fas fa-search"></i>`,
            info: "Página _START_ de _END_",
            paginate: {
                'previous': '<span class="prev-icon">Anterior</span>',
                'next': '<span class="next-icon">Seguinte</span>'
            },
            sEmptyTable: "Não existem serviços para este estado.",
            // sSearch: "your-text-here"
        },
        searching: true,
        info: true,
        paging: true,
        order: [],
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        fnRowCallback: function(row, rowData) {
            let rowInfo = {
                id: rowData.JOB_ID,
                priority: rowData.PRIORITY_CODE,
                priorityWork: rowData.PRIORITY_WORK
            };

            $(row).attr("scope", "row").attr("draggable", "true").attr("data-rowinfo", JSON.stringify(rowInfo));     
        },
        columnDefs: [
            { targets: 0, className: "text-center", width: "25px" },
            { targets: 2, width: "115px" },
            { targets: 4, className: "text-center" },
            { targets: 5, className: "text-center" },
            { targets: 7, className: "text-center tableJobTdIcon", width: "20px" },
            { orderable: false, targets: [1, 2, 3, 4, 5, 6, 7] },
        ],
        columns: [
            { data: 'JOB_ID' },
            { data: null, render : function (rowData, type) {
                if (type === "display") {
                    return `${rowData.EQUIPMENT_TYPE_DESCRIPTION} (${rowData.EQUIPMENT_BRAND_DESCRIPTION})<br><small>(${rowData.EQUIPMENT_PROCEDURE_DESCRIPTION})</small>`;
                } 
                else 
                {
                    return rowData;
                }
             }
            },
            { data: null, render : function (rowData, type) {
                if (type === "display") {
                    return `${rowData.USER_NAME_CREATED}<br><small>(${rowData.DATE_STARTED})</small>`;
                } 
                else 
                {
                    return rowData;
                }
             }
            },
            { data: null, render : function (rowData, type) {
                if (type === "display") {
                    return `${rowData.CLIENT_NAME}<br><small>(${rowData.CLIENT_EMAIL})</small>`;
                } 
                else 
                {
                    return rowData;
                }
             }
            },
            { data: null, render : function (rowData, type) {
                    if (type === "display") {
                        if (rowData.STATUS_PROGRESS_CODE === "1") { //Em progresso
                            return `<span class="badge badge-secondary">${rowData.STATUS_PROGRESS_DESCRIPTION}</span>`;
                        }
                        else if (rowData.STATUS_PROGRESS_CODE === "2") { //Pendente
                            return `<span class="badge badge-danger">${rowData.STATUS_PROGRESS_DESCRIPTION}</span>`;
                        }
                        else if (rowData.STATUS_PROGRESS_CODE === "3") { //Em espera
                            return `<span class="badge badge-warning">${rowData.STATUS_PROGRESS_DESCRIPTION}</span>`;
                        }
                        else if (rowData.STATUS_PROGRESS_CODE === "4") { //Concluido
                            return `<span class="badge badge-dark">${rowData.STATUS_PROGRESS_DESCRIPTION}</span><br><small>(${rowData.DATE_FINISHED})</small>`;
                        }
                        else if (rowData.STATUS_PROGRESS_CODE === "5") { //A espera de material 
                            return `<span class="badge badge-warning">${rowData.STATUS_PROGRESS_DESCRIPTION}</span>`;
                        }
                        else 
                        {
                            return rowData.STATUS_PROGRESS_DESCRIPTION;
                        }
                    } 
                    else 
                    {
                        return rowData;
                    }
              }
            },
            { data: null, render : function (rowData, type) {
                if (type === "display") {
                    if (rowData.PRIORITY_CODE === "1") { //Prioridade máxima
                        return `<span class="badge badge-danger">${rowData.PRIORITY_DESCRIPTION}</span><br><small><b>(${rowData.PRIORITY_WORK})</b></small>`;
                    }
                    else if (rowData.PRIORITY_CODE === "2") { //Prioridade média
                        return `<span class="badge badge-warning">${rowData.PRIORITY_DESCRIPTION}</span><br><small><b>(${rowData.PRIORITY_WORK})</b></small>`;
                    }
                    else if (rowData.PRIORITY_CODE === "3") { //Prioridade normal
                        return `<span class="badge badge-light">${rowData.PRIORITY_DESCRIPTION}</span><br><small><b>(${rowData.PRIORITY_WORK})</b></small>`;
                    }
                    else if (rowData.PRIORITY_CODE === "4") { //Prioridade baixa
                        return `<span class="badge badge-secondary">${rowData.PRIORITY_DESCRIPTION}</span><br><small><b>(${rowData.PRIORITY_WORK})</b></small>`;
                    }
                    else 
                    {
                        return rowData.STATUS_PROGRESS_DESCRIPTION;
                    }
                } 
                else 
                {
                    return rowData;
                }
             }
            },
            { data: 'NOTES' },
            { data: null, render : function (data, type, _, settings) {
                if (type === "display") {
                    return `<i class="fas fa-edit table-job-icon-edit" data-jobid="${data.JOB_ID}"></i>`;
                } 
                else  
                { 
                    return data;
                }
              }
            }
        ]
    });
}

function openNewServiceModal(){
    let container = $("#newCreateServiceContainer");

    let dropEquipmentType = $("#inputEquipmentType1");
    dropEquipmentType.find(`option[value='1']`).prop("selected", true);

    let textareaEquipmentType1 = $("#textareaEquipmentType1");
    textareaEquipmentType1.val("");
    textareaEquipmentType1.parent().addClass("textareaEquipmentTypeDescription1");

    let dropEquipmentBrand= $("#inputEquipmentBrand1");
    dropEquipmentBrand.find(`option[value='1']`).prop("selected", true);

    let dropEquipmentProcedure = $("#inputEquipmentProcedure1");
    dropEquipmentProcedure.find(`option[value='1']`).prop("selected", true);

    let textareaEquipmentProcedure1 = $("#textareaEquipmentProcedure1");
    textareaEquipmentProcedure1.val("");
    textareaEquipmentProcedure1.parent().addClass("textareaEquipmentProcedureDescription1");

    let editJobStatus = $("#inputJobStatus1");
    editJobStatus.find(`option[value='1']`).prop("selected", true);
    editJobStatus.find(`option[value='4']`).hide();

    let dropCreateClient = $("#dropCreateClient");
    dropCreateClient.find(`option[value='0']`).prop("selected", true);

    setPriorityCard("4", "jobCreateCardDetailsPriority");

    container.show();
}

function saveJobInformation(){
    let container = $("#newServiceContainer");
    const jobId = parseInt( container.attr("data-jobId"));
   
    let job = new JobInfo(jobId);
    job.userId = userDetails.id;

    job.equipmentType = $("#inputEquipmentType").val();
    if (job.equipmentType === "100") {
        job.equipmentTypeOther = $("#textareaEquipmentType").val();
    }

    job.equipmentBrand = $("#inputEquipmentBrand").val();

    job.equipmentProcedure = $("#inputEquipmentProcedure").val();
    if (job.equipmentProcedure === "100") {
        job.equipmentProcedureOther = $("#textareaEquipmentProcedure").val();
    }

    job.notes = $("#textareaJobNotes").val();

    job.status = $("#inputJobStatus").val();

    job.priority = $(".jobEditCardDetailsPriority").find(".card-body-header .badge").attr("data-code");
 
    editJobInfoAjax(job, (success) => {
        if (!success) {
            alert("Algo correu mal. tente outravez.");
            return;
        }

        loadListJobs();
        container.hide();
    });

}

function createJobInformation() {
    let container = $("#newCreateServiceContainer");

    let job = new JobInfo(0);

    job.equipmentType = $("#inputEquipmentType1").val();
    if (job.equipmentType === "100") {
        job.equipmentTypeOther = $("#textareaEquipmentType1").val();
    }

    job.equipmentBrand = $("#inputEquipmentBrand1").val();

    job.equipmentProcedure = $("#inputEquipmentProcedure1").val();
    if (job.equipmentProcedure === "100") {
        job.equipmentProcedureOther = $("#textareaEquipmentProcedure1").val();
    }

    job.notes = $("#textareaJobNotes1").val();
    if (job.notes === "") {
        job.notes = null;
    }

    job.status = $("#inputJobStatus1").val();

    job.userId = userDetails.id;

    job.userIdClient = parseInt($("#dropCreateClient").val());

    job.priority = $(".jobCreateCardDetailsPriority").find(".card-body-header .badge").attr("data-code");

    if (job.userIdClient === 0) {
        alert("Cliente tem de ser especificado.");
        return;
    }

    createNewJobAjax(job, (success) => {
        if (!success) {
            alert("Algo correu mal. Tente outravez.");
            return;
        }

        loadListJobs();
        container.hide();
    });
}



//============================================= HELPER FUNCTIONS
function getCurrentTypeStatusJobScreen(){
    let option = $("#dropDownTypeJobList").val();
    return new JobTyperequest(option, option === "ME" ? userDetails.id : 0);
}

function editJobOpenModal(jobId){
    let job = jobsArray.filter((j)=>{ return j.JOB_ID === jobId; })[0];
  
    let dropEquipmentType = $("#inputEquipmentType");
    dropEquipmentType.find(`option[value='${job.EQUIPMENT_TYPE}']`).prop("selected", true);

    let dropEquipmentBrand = $("#inputEquipmentBrand");
    dropEquipmentBrand.find(`option[value='${job.EQUIPMENT_BRAND}']`).prop("selected", true);

    let dropEquipmentTypeTextarea = $("#textareaEquipmentType");
    let dropEquipmentTypeTextareaContent = dropEquipmentTypeTextarea.parent();

    if (job.EQUIPMENT_TYPE === "100") {  
        dropEquipmentTypeTextarea.val(job.EQUIPMENT_TYPE_DESCRIPTION);        
        dropEquipmentTypeTextareaContent.removeClass("textareaEquipmentTypeDescription");
    }
    else
    {
        dropEquipmentTypeTextarea.val("");        
        dropEquipmentTypeTextareaContent.addClass("textareaEquipmentTypeDescription");
    }

    let dropEquipmentProcedure = $("#inputEquipmentProcedure");
    dropEquipmentProcedure.find(`option[value='${job.EQUIPMENT_PROCEDURE}']`).prop("selected", true);

    let dropEquipmentProcedureTextarea = $("#textareaEquipmentProcedure");
    let dropEquipmentProcedureTextareaContent = dropEquipmentProcedureTextarea.parent();

    if (job.EQUIPMENT_PROCEDURE === "100") {          
        dropEquipmentProcedureTextarea.val(job.EQUIPMENT_TYPE_DESCRIPTION);        
        dropEquipmentProcedureTextareaContent.removeClass("textareaEquipmentProcedureDescription");
    }
    else
    {
        dropEquipmentProcedureTextarea.val("");        
        dropEquipmentProcedureTextareaContent.addClass("textareaEquipmentProcedureDescription");
    }

    let notes = $("#textareaJobNotes");
    notes.val(job.NOTES);

    let clientName =  $("#inputClientName");
    clientName.val(job.CLIENT_NAME);

    let clientEmail = $("#inputClientEmail");
    clientEmail.val(job.CLIENT_EMAIL);

    let clientNif = $("#inputClientNif");
    clientNif.val(job.CLIENT_NIF);

    let editJobStatus = $("#inputJobStatus");
    editJobStatus.find(`option[value='${job.STATUS_PROGRESS_CODE}']`).prop("selected", true);
    editJobStatus.find(`option[value='4']`).show();

    setPriorityCard(job.PRIORITY_CODE, "jobEditCardDetailsPriority");
    
    let divInfoFinalised = $(".editJobFinalisedDiv");

    let buttonReopenJob = $(".newServiceContainerOuterBodyFooter .btnReopen");

    let jobEditCardDetailsPriority = $(".jobEditCardDetailsPriority").find(".card-body-body");
    
    if (job.STATUS_PROGRESS_CODE === "4") {
        dropEquipmentType.attr("disabled", "disabled");
        dropEquipmentBrand.attr("disabled", "disabled");
        dropEquipmentTypeTextarea.attr("disabled", "disabled");
        dropEquipmentProcedure.attr("disabled", "disabled");
        dropEquipmentProcedureTextarea.attr("disabled", "disabled");
        notes.attr("disabled", "disabled");
        editJobStatus.attr("disabled", "disabled");

       
        divInfoFinalised.find(".alert").html(`Concluido por: ${job.USER_FINALISED} <small>(${job.DATE_FINISHED})</small>`);
        divInfoFinalised.show();

        jobEditCardDetailsPriority.hide();

        buttonReopenJob.attr("data-id", job.JOB_ID);
        buttonReopenJob.show();        
    }
    else
    {
        dropEquipmentType.removeAttr("disabled");
        dropEquipmentBrand.removeAttr("disabled");
        dropEquipmentTypeTextarea.removeAttr("disabled");
        dropEquipmentProcedure.removeAttr("disabled");
        dropEquipmentProcedureTextarea.removeAttr("disabled");
        notes.removeAttr("disabled");
        editJobStatus.removeAttr("disabled");

        divInfoFinalised.find(".alert").html("");
        divInfoFinalised.hide();

        jobEditCardDetailsPriority.show();

        buttonReopenJob.hide();
    }

    let container = $("#newServiceContainer");
    container.attr("data-jobId", jobId);
    container.show();
}

function setPriorityCard(prioritySelected, classCard){
    const priorityList = initPageState[5];
    // console.log(prioritySelected);
    // console.log(priorityList);

    let jobCardDetailsPriority = $(`.${classCard}`);
    let jobCardDetailsPriorityHeader = jobCardDetailsPriority.find(".card-body-header");
    let jobCardDetailsPriorityBody = jobCardDetailsPriority.find(".card-body-body");
    jobCardDetailsPriorityHeader.empty();
    jobCardDetailsPriorityBody.empty();

    priorityList.filter((p)=>{ return p.code === prioritySelected; }).forEach((p)=>{
        if (p.code === "1") {
            jobCardDetailsPriorityHeader.append(`<span data-code="${p.code}" class="badge badge-danger">${p.description}</span>`);
        }
        else if (p.code === "2") {
            jobCardDetailsPriorityHeader.append(`<span data-code="${p.code}" class="badge badge-warning">${p.description}</span>`);
        }
        else if (p.code === "3") {
            jobCardDetailsPriorityHeader.append(`<span data-code="${p.code}" class="badge badge-light">${p.description}</span>`);
        }
        else if (p.code === "4") {
            jobCardDetailsPriorityHeader.append(`<span data-code="${p.code}" class="badge badge-secondary">${p.description}</span>`);
        }
    });

    priorityList.filter((p)=>{ return p.code !== prioritySelected; }).forEach((p)=>{
        if (p.code === "1") {
            jobCardDetailsPriorityBody.append(`<span draggable="true" data-code="${p.code}" class="badge badge-danger">${p.description}</span>`);
        }
        else if (p.code === "2") {
            jobCardDetailsPriorityBody.append(`<span draggable="true" data-code="${p.code}" class="badge badge-warning">${p.description}</span>`);
        }
        else if (p.code === "3") {
            jobCardDetailsPriorityBody.append(`<span draggable="true" data-code="${p.code}" class="badge badge-light">${p.description}</span>`);
        }
        else if (p.code === "4") {
            jobCardDetailsPriorityBody.append(`<span draggable="true" data-code="${p.code}" class="badge badge-secondary">${p.description}</span>`);
        }
    });
}



//============================================= AJAX CALLS
function getListJobsAjax(type, callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";
    xhr.open("POST", `/api/getListJobs`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const { jobs } = xhr.response;
            saveUserJobsLocalStorage(jobs);
            callback(jobs);
        }
        else if (this.readyState === 4) {
            console.log(this.status);
            console.log(this.statusText);

            const jobs = getUserJobsLocalStorage();
            callback(jobs);
        }
    };
    xhr.send(JSON.stringify(type));
}

function getInformationTobuildInitialPageStateAjax(callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";
    xhr.open("GET", "/api/getUserInfoInitState", true);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            initPageState = xhr.response.initPageState;
            callback();
        }
        else if (this.readyState === 4) {
            console.log(this.status);
            console.log(this.statusText);
            callback();
        }
    };
    xhr.send();
}

function editJobInfoAjax(job, callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";    
    xhr.open("PUT", "/api/editJobInfo", true);
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
    xhr.send(JSON.stringify(job));
}

function createNewJobAjax(job, callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";    
    xhr.open("POST", "/api/createJob", true);
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
    xhr.send(JSON.stringify(job));
}

function reopenJobAjax(JobId, callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";    
    xhr.open("PUT", "/api/reopenJob", true);
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
    xhr.send(JSON.stringify({JobId: JobId}));
}

function editOrderPriority(startRowInfo, endRowInfo, callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";    
    xhr.open("PUT", "/api/editOrderPriority", true);
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
    xhr.send(JSON.stringify({startRowInfo: startRowInfo, endRowInfo: endRowInfo}));
}