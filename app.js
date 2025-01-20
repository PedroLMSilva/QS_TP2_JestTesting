"use strict";
const express = require("express");
const clientsHandlers = require("./scripts/clients-handlers.js");
const usersHandlers = require("./scripts/users-handlers.js");
const authenticationHandlers = require("./scripts/authentication-handlers.js");
const globalHandlers = require("./scripts/globalHandlers.js");
const jobsHandlers = require("./scripts/jobs-handlers.js");
const messagingHandlers = require("./scripts/messaging-handlers.js");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const path = require("path");
const fs = require('fs');

const http = require("http"); 
const WebSocketServer = require('websocket').server;
 


app.use(bodyParser.json());

app.use(session({
    secret: "ThisIsOurSecretKeyToGenerateSessionButWeShouldUseUUID",
    saveUninitialized:true,
    //cookie: { maxAge: oneDay },
    resave: false
}));

const homePage = "/home.html";

function isUserLoggedIn(request){
    const user = request.session.User;
    //console.log(user);
    return user === undefined ? false : true;
}

app.use((request, response, next) => {
    let url = request.url;

    if (url.match(/\//gi).length > 1) {
        next();
        return;
    }

    if (!isUserLoggedIn(request)) {
        if (url !== "/login.html") {
            response.redirect("/login.html");
            return;
        }
        next();
        return;
    }

    if (url === "/login.html" || url === "/") {
        response.redirect(homePage);
        return;
    }

    const currentPath = path.join(__dirname, "www", url);
    if (!fs.existsSync(currentPath)) {
        response.redirect("/login.html");
        return;
    }

    next();
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("www"));

//============================================================= Ajax Messinging
app.post("/api/loadWebSocketSettings", messagingHandlers.loadWebSocketSettings);
app.post("/api/loadWebSocketMessages", messagingHandlers.loadWebSocketMessages);



//============================================================= Ajax Client Page
app.get("/api/getClients", clientsHandlers.getClients);
app.put("/api/editClient", clientsHandlers.editClient);
app.delete("/api/deleteClient/:id", clientsHandlers.deleteClient);
app.post("/api/createClient", clientsHandlers.createClient);

//============================================================= Ajax Users Page
app.get("/api/getUsers", usersHandlers.getUsers);
app.get("/api/getPageSettings", usersHandlers.getPageSettings);
app.post("/api/createUser", usersHandlers.createUser);
app.put("/api/editUser", usersHandlers.editUser);
app.delete("/api/deleteUser/:id", usersHandlers.deleteUser);

//============================================================= Ajax Login Page
app.post("/api/login", authenticationHandlers.login);


//============================================================= Ajax Home Page
app.post("/api/getListJobs", jobsHandlers.getListJobs);
app.post("/api/createJob", jobsHandlers.createJob);
app.get("/api/getUserInfoInitState", jobsHandlers.getUserInfoInitState);
app.put("/api/reopenJob", jobsHandlers.reopenJob);
app.put("/api/editJobInfo", jobsHandlers.editJobInfo);
app.put("/api/editOrderPriority", jobsHandlers.editOrderPriority);


//============================================================= Ajax Global
app.get("/api/logout", globalHandlers.logout);


app.listen(8081, function () {
    console.log("Server running at http://localhost:8081");
});

const server = http.createServer(function (request, response) { });
server.listen(7071);

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections:false
});

var webSocketClients = [];

wsServer.on("request", (request) => {
    let client = request.accept(null, request.origin);

    client.on('message', function(messageType){
        //console.log(messageType);
        if(messageType.type !== "utf8"){
            return;
        }

        const message = JSON.parse(messageType.utf8Data);
  
        if (message.type === "connection") {
            connectClient(message, client);
        }
        else if (message.type === "send") {
            connectMessage(message);
        }
    });

    client.on('close', function(reasonCode, description) {
        disconnectClient(client);
    });
});

function connectMessage(message){
    const idToSendMessage = message.to;
    let client = findClientById(idToSendMessage);
    if (client === null) {
        messagingHandlers.messagingInsertNew(message, (row)=> {});
        return;
    }
    messagingHandlers.messagingInsertNew(message, (row)=> {
        if (row === -1) {
            return;
        }
        client.client.send(JSON.stringify({ type: "received", id: message.from }));
    });
}

function connectClient(message, client){
    const foundClient = findClientById(message.id);

    if (foundClient !== null) {
        return;
    }

    if (message.id === undefined) {
        return;
    }

    webSocketClients.push({
        id: message.id,
        client: client
    });
}

function findClientById(id) {
    const index = webSocketClients.findIndex(c => c.id === id);

    if (index === -1) {
        return null;
    }

    return webSocketClients[index];
}

function disconnectClient(client){
    const index = webSocketClients.findIndex(c => c.client === client);

    if (index === -1) {
        return;
    }

    webSocketClients.splice(index, 1);
}



module.exports = app;
