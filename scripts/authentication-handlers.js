"use strict";
const mysql = require("mysql2");
const options = require("./connection-options.json");

module.exports.login = (request, response) => {
    let connection = mysql.createConnection(options);
    connection.connect();

    let query = `
        SELECT U.id, U.userName, U.name, U.email, 
        U.ROLE AS roleCode, ROLE_CODE.DESCRIPTION AS roleDescription 
        FROM USER U
        INNER JOIN CODES ROLE_CODE ON ROLE_CODE.CODE = U.ROLE
        WHERE (U.USERNAME = ? OR U.email = ?) AND U.PASSWORD = ?
    `;

    console.log("login: " + request.body.login + " pw: " + request.body.password);
    
    connection.query(query, [request.body.login, request.body.login, request.body.password], function (err, row) {        
        if (err) {
            response.sendStatus(500);
            console.log("err: ", err);
        } else if (row.length === 0) {
            response.sendStatus(401);
            console.log("user not found");
        } else {
            //Add user to the session
            request.session.User = row[0];
            response.send(JSON.stringify(row[0]));
        }
    });
}