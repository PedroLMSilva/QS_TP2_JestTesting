"use strict";
const mysql = require("mysql2");
const options = require("./connection-options.json");


//============================================================= Logout
module.exports.logout = (request, response) => {
    request.session.User = undefined;
    response.sendStatus(200);
}
