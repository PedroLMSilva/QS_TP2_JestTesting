"use strict";
const mysql = require("mysql2");
const options = require("./connection-options.json");

module.exports.getClients = (request, response) => {
    let connection = mysql.createConnection(options);
    connection.connect();
    let query = `
        SELECT C.id, C.name, C.address, C.postCode, C.email, C.nif, 
        SUM((CASE WHEN J.ID IS NOT NULL THEN 1 ELSE 0 END)) AS TOTAL_JOBS,
        SUM((CASE WHEN J.ID IS NOT NULL AND J.STATUS = '4' THEN 1 ELSE 0 END)) AS TOTAL_JOBS_FINALISED
        FROM CLIENT C 
        LEFT JOIN JOB J ON J.USERIDCLIENT = C.ID
        GROUP BY C.id, C.name, C.address, C.postCode, C.email, C.nif
        ORDER BY C.ID ASC
    `;
    
    connection.query(query, function (err, rows) {
        if (err) {
            console.log(err)
            response.json({clients: [] });
        } else {
            response.json({clients: rows });
        }
    });
}

module.exports.editClient = (request, response) => {
    let connection = mysql.createConnection(options);
    connection.connect();
    let query = "UPDATE client SET name = ?, address = ?, postCode = ?, email = ?, nif = ? WHERE ID = ?";
    connection.query(query, [request.body.name, request.body.address, request.body.postCode, request.body.email, request.body.nif, request.body.id], function (err, rows) {
        if (err) {
            console.log(err)
            response.json({success: false});
        } 
        else 
        {
            response.json({success: true});
        }
    });
}

module.exports.deleteClient = (request, response) => {
    let connection = mysql.createConnection(options);
    connection.connect();
    let query = "DELETE FROM client WHERE id = ?";
    connection.query(query, [request.params.id], function (err, rows) {
        if (err) {
            console.log(err);
            response.sendStatus(500);
        } 
        else 
        {
            response.sendStatus(200);
        }
    });
}

module.exports.createClient = (request, response) => {
    let connection = mysql.createConnection(options);
    connection.connect();
    let query = "INSERT INTO CLIENT (NAME, ADDRESS, POSTCODE, EMAIL, NIF) VALUES (?, ?, ?, ?, ?)";
    connection.query(query, [request.body.name, request.body.address, request.body.postCode, request.body.email, request.body.nif], function (err, rows) {
        if (err) {
            console.log(err);
            response.sendStatus(500);
        } 
        else 
        {
            response.sendStatus(200);
        }
    });
}