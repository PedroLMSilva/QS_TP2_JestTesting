var userDetails = null;

var messagingMode = {
    enable: true,
    url: "ws://localhost:7071/",
    ws: null,
    Users: [],
    UserSelected: null,
    Messages: [],
    dateNow: null
};

$(document).ready(()=>{
    $("#buttonLogout").on("click", function(event){
        event.stopPropagation();
        event.preventDefault();

        logOutAjax((success) => {
            if (success) {
                location.href = "/login.html";
                return;
            }
            alert("Algo correu mal. Tente outravez.");
        });
    });

    $("#userLabelIcon").on("click", function(event){
        event.stopPropagation();
        event.preventDefault();
    });

    initUserDetailsAndRoles();

    initWebSocketMessaging();
});

function initUserDetailsAndRoles(){
    const url = location.href;
    if (url.includes("/login.html")) {
        resetLocalStorage();
        return;
    }

    userDetails = getUserDetails();
 
    if (userDetails === null) {
        return;
    } 

    $("#userLabelIcon").text(`${userDetails.name} (${userDetails.roleDescription})`);
    $("#navbarDropdownMenuLinkUserId").text(userDetails.userName);

    if (userDetails.roleCode !== "A") {
        $("#usersNavBarItem").hide();
    }

}

//Test purposes only
function getBrowser(){
    if (window.navigator.userAgent.toLowerCase().indexOf("edg") > -1) {
        return "edge";
    }
    return "chrome";
}


//===================================================================== Classes
class Client {    
    constructor(id, name, address, postCode, email, nif) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.postCode = postCode;
        this.email = email;
        this.nif = nif;
    }
}

class User {
    constructor(id, userName, name, email, role, password) {
        this.id = id;
        this.userName = userName;
        this.name = name;
        this.email = email;
        this.role = role;
        this.password = password;
    }
}

class JobInfo {
    constructor(id) {
        this.id = id;
        this.userId = 0;
        this.userIdClient = 0;
        this.status = "";
        this.equipmentType = "";
        this.equipmentBrand = "";
        this.equipmentTypeOther = "";
        this.equipmentProcedure = "";
        this.equipmentProcedureOther = "";
        this.notes = "";
        this.dateFinished = null;
        this.dateStarted = null;
        this.priority = "1";
        this.priorityWork = "0";
    }
}

class JobTyperequest {
    constructor(type, identifier) {
        this.type = type;
        this.identifier = identifier;
    }
}

class MessageSocket {
    constructor(type, id, from, to, message, dateCreated){
        this.type = type;
        this.id = id;
        this.from = from;
        this.to = to;
        this.message = message;
        this.dateCreated = dateCreated;
        this.seen = "N";
    }
}

//===================================================================== Logout function
function logOutAjax(callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";
    xhr.open("GET", "/api/logout", true);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            resetLocalStorage();
            callback(true);
        }
        else if (this.readyState === 4) {
            callback(false);
        }
    };
    xhr.send();
}


//===================================================================== Local Storage functions
function resetLocalStorage() {    
    saveClientsLocalStorage(null);
    SaveUserDetails(null);
    saveUsersLocalStorage(null);
    saveUserJobsLocalStorage(null);
}

function SaveUserDetails(user){
    if (!localStorage) {
        return;
    }

    if (user === null) {
        localStorage.removeItem("userdetails");
        return;
    }

    localStorage.setItem("userdetails", JSON.stringify(user));
}

function getUserDetails(){
    if (!localStorage) {
        return null;
    }

    const user = localStorage.getItem("userdetails");

    if (!user) {
        return null;
    }
    
    return JSON.parse(user);
}

function saveClientsLocalStorage(clients) {
    if (!localStorage) {
        return;
    }

    if (clients === null) {
        localStorage.removeItem("clients");
        return;
    }

    localStorage.setItem("clients", JSON.stringify(clients));
}

function getClientsLocalStorage() {
    if (!localStorage) {
        return [];
    }

    const clients = localStorage.getItem("clients");

    if (!clients) {
        return [];
    }
    
    return JSON.parse(clients);
}


function saveUsersLocalStorage(users) {
    if (!localStorage) {
        return;
    }

    if (users === null) {
        localStorage.removeItem("users");
        return;
    }

    localStorage.setItem("users", JSON.stringify(users));
}

function getUsersLocalStorage() {
    if (!localStorage) {
        return [];
    }

    const users = localStorage.getItem("users");

    if (!users) {
        return [];
    }
    
    return JSON.parse(users);
}


function saveUserJobsLocalStorage(jobs) {
    if (!localStorage) {
        return;
    }

    if (jobs === null) {
        localStorage.removeItem("user_jobs");
        return;
    }

    localStorage.setItem("user_jobs", JSON.stringify(jobs));
}

function getUserJobsLocalStorage() {
    if (!localStorage) {
        return [];
    }

    const jobs = localStorage.getItem("user_jobs");

    if (!jobs) {
        return [];
    }
    
    return JSON.parse(jobs);
}





//====================================================================== MESSAGING
function initWebSocketMessaging(){
    const url = location.href;
    if (url.includes("/login.html")) {
        return;
    }

    const { enable } = messagingMode;
  
    if (!enable) {
        return;
    }

    $("#topButtonMenuMessage").on("click", function(event) {
        event.stopPropagation();
        event.preventDefault();
        let messageContainer = $(".container-direct-menssage");
        messageContainer.toggle();
        $("#dropdownMessageMenuBody").scrollTop(5000);
        $(this).blur();
    });

    $("#buttonSendMessage").on("click", function(event) {
        event.stopPropagation();
        event.preventDefault();

        let inpMessage = $("#inpWebSocketMessage");
        let message = inpMessage.val();
        if (message === "") {
            return;
        }
 
        //Builds the message and sends it to the server
        const menssageToSend = new MessageSocket("send", 0, userDetails.id, messagingMode.UserSelected.ID, message);        
        messagingMode.ws.send(JSON.stringify(menssageToSend));

        //Updates UI with the message
        const dateCreated = messagingMode.dateNow + ` ${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")}:${new Date().getSeconds().toString().padStart(2, "0")}`;
        let messageBody = $("#dropdownMessageMenuBody");
        messageBody.append(userMessageHtmlCode(userDetails.userName, dateCreated, menssageToSend.message, true));
        messageBody.scrollTop(5000);
    
        inpMessage.val("");
    });
    
    $(document).keydown(function(e) {
        if (e.key === "Enter") {
            let messageContainer = $(".container-direct-menssage");
            if (messageContainer.css("display") === "block") {
                $("#buttonSendMessage").trigger("click");
            }
        }
    });

    $("#topButtonMenuMessage").show();

    loadWebSocketMessagingAjax(()=>{
        initWebSocketMessagingDataPage();
    });
}

function initWebSocketMessagingDataPage(){
    //console.log(messagingMode);
    let dropdown = $("#dropdownMessageMenuLink");
    let ul = dropdown.parent().find(".dropdown-menu");
    
    messagingMode.Users.forEach((user)=>{
        ul.append(`<a class='dropdown-item' href='#' onclick='Javascript:switchUserMessaging(${JSON.stringify(user)});'>${user.NAME}</a>`);
    });

    messagingMode.ws = new WebSocket(messagingMode.url);

    messagingMode.ws.onopen = () => {        
        const conn = new MessageSocket("connection", userDetails.id);
        messagingMode.ws.send(JSON.stringify(conn));
    }

    messagingMode.ws.onmessage = (e) => {
        let message = JSON.parse(e.data);
        if (message.type === "received") {
            loadWebSocketMessagingMessagesAjax(()=>{
                //Checks if the current message received is for the selected user
                if (message.id !== messagingMode.UserSelected.ID) {
                    return;
                }

                updateUserMessagingContainer();
            });
        }
    }

    updateUserMessagingContainer();
}

function updateUserMessagingContainer(){
    const { UserSelected } = messagingMode;

    //Updates the title message with the current user selected
    $("#containerDirectMenssageTitle").html(`Mensagens <span>(${UserSelected.NAME})</span>`);

    let messageBody = $("#dropdownMessageMenuBody");
    messageBody.empty();

    //Gets all messages that were sent or received with the selected user
    let messages = messagingMode.Messages.filter((m)=>{ return m.MESSAGE_TO_ID === UserSelected.ID || m.MESSAGE_FROM_ID === UserSelected.ID; });
    messages = messages.sort((m1, m2) => { return m1.MESSAGE_ID - m2.MESSAGE_ID; });

    //Loops through all messages and builds the UI 
    messages.forEach((message)=>{
        if (message.MESSAGE_SENT_BY === userDetails.id) {
            if (message.MESSAGE_FROM_ID === userDetails.id) {
                messageBody.append(userMessageHtmlCode(message.USERNAME_FROM, message.DATE_CREATED, message.MESSAGE, true));
            }
            else 
            {
                messageBody.append(userMessageHtmlCode(message.USERNAME_TO, message.DATE_CREATED, message.MESSAGE, false));
            }
        }
        else 
        {
            if (message.MESSAGE_FROM_ID === userDetails.id) {
                messageBody.append(userMessageHtmlCode(message.USERNAME_TO, message.DATE_CREATED, message.MESSAGE, true));
            }
            else 
            {
                messageBody.append(userMessageHtmlCode(message.USERNAME_FROM, message.DATE_CREATED, message.MESSAGE, false));
            }
        }
    });

    messageBody.scrollTop(5000);
}

function switchUserMessaging(user) {
    messagingMode.UserSelected = user;

    updateUserMessagingContainer();

    return false;

}

function loadWebSocketMessagingAjax(callback){
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";
    xhr.open("POST", `/api/loadWebSocketSettings`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //console.log(xhr.response);
            messagingMode.Users = xhr.response[0];
            messagingMode.UserSelected = messagingMode.Users[0];
            messagingMode.Messages = xhr.response[1];
            messagingMode.dateNow = xhr.response[2][0].DATE_NOW;
            callback();
        }
        else if (this.readyState === 4) {
            console.log(this.status);
            console.log(this.statusText);
            callback();
        }
    };
    xhr.send(JSON.stringify(userDetails));
}

function loadWebSocketMessagingMessagesAjax(callback){ 
    let xhr = new XMLHttpRequest();
    xhr.responseType="json";
    xhr.open("POST", `/api/loadWebSocketMessages`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            messagingMode.Messages = xhr.response;
            callback();
        }
        else if (this.readyState === 4) {
            console.log(this.status);
            console.log(this.statusText);
            callback();
        }
    };
    xhr.send(JSON.stringify(userDetails));
}

//Returns html that builds the message UI
function userMessageHtmlCode(from, date, message, us){
    return `
        <div class="message-container-info${(us ? "" : " message-container-right")}">
            <label class="message-title">
                <span>${(us ? ("<small>(eu)</small> " + from) : from)}</span> <small>(${date})</small>
            </label>
            <div class="alert alert-${(us ? "primary": "success")}" role="alert">${message}</div>
        </div>
    `;
}