"use strict";
const mysql = require("mysql2");
const options = require("./connection-options.json");

module.exports.loadWebSocketSettings = (request, response) => {
    let connection = mysql.createConnection(options);
    connection.connect();

    //console.log(request.body)
    
    let query1 = `SELECT ID, USERNAME, NAME, EMAIL, ROLE FROM USER WHERE ID != ?`;
    let query2 = `
        SELECT 
        M.MESSAGE_SENT_BY,
        M.MESSAGE_TO AS MESSAGE_TO_ID, USER_TO.USERNAME AS USERNAME_TO,
        M.MESSAGE_FROM AS MESSAGE_FROM_ID, USER_FROM.USERNAME AS USERNAME_FROM,
        M.MESSAGE, UPPER(DATE_FORMAT(M.DATE_CREATED, '%d-%b-%Y %H:%i:%s')) AS DATE_CREATED, M.SEEN,
        M.MESSAGE_ID   
        FROM MESSAGES M
        INNER JOIN USER USER_FROM ON USER_FROM.ID = M.MESSAGE_FROM
        INNER JOIN USER USER_TO ON USER_TO.ID = M.MESSAGE_TO
        WHERE (M.MESSAGE_FROM = ? OR M.MESSAGE_TO = ?)
        ORDER BY M.DATE_CREATED DESC`;
    let query3 = "SELECT UPPER(DATE_FORMAT(SYSDATE(), '%d-%b-%Y')) AS DATE_NOW FROM USER LIMIT 1";

    connection.query(`${query1}; ${query2}; ${query3}`, [request.body.id, request.body.id, request.body.id], function (err, results) {
        if (err) {
            console.log(err)
            response.json([]);
            return;
        } 
        //console.log(results);
        response.json(results); 
    });
}

module.exports.messagingInsertNew = (message, callback) => {
    let connection = mysql.createConnection(options);
    connection.connect();

    let query = `INSERT INTO MESSAGES (message_sent_by, message_from, message_to, message, date_created, seen) VALUES(?, ?, ?, ?, ?, ?)`;

    const dateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');

    connection.query(query, [message.from, message.from, message.to, message.message, dateCreated, message.seen], function (err, result) {
        if (err) {
            console.log(err)
            callback(-1);
            return;
        } 
        callback(result.insertId);
    });
}

module.exports.loadWebSocketMessages = (request, response) => {
    //console.log(request.body);
    let connection = mysql.createConnection(options);
    connection.connect();
    let query = `
        SELECT 
        M.MESSAGE_SENT_BY,
        M.MESSAGE_TO AS MESSAGE_TO_ID, USER_TO.USERNAME AS USERNAME_TO,
        M.MESSAGE_FROM AS MESSAGE_FROM_ID, USER_FROM.USERNAME AS USERNAME_FROM,
        M.MESSAGE, UPPER(DATE_FORMAT(M.DATE_CREATED, '%d-%b-%Y %H:%i:%s')) AS DATE_CREATED, M.SEEN,
        M.MESSAGE_ID   
        FROM MESSAGES M
        INNER JOIN USER USER_FROM ON USER_FROM.ID = M.MESSAGE_FROM
        INNER JOIN USER USER_TO ON USER_TO.ID = M.MESSAGE_TO
        WHERE (M.MESSAGE_FROM = ? OR M.MESSAGE_TO = ?)
        ORDER BY M.DATE_CREATED DESC`;

    connection.query(query, [request.body.id, request.body.id], function (err, result) {
        if (err) {
            console.log(err)
            response.json([]);
            return;
        } 
        response.json(result); 
    });
}
