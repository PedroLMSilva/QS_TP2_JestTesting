"use strict";
const mysql = require("mysql2");
const options = require("./connection-options.json");

module.exports.getUsers = (request, response) => {
    let connection = mysql.createConnection(options);
    connection.connect();
    let query = `
        SELECT U.id, U.userName, U.name, U.email, 
        U.ROLE AS roleCode, ROLE_CODE.DESCRIPTION AS roleDescription,
        COUNT(J.ID) AS TOTAL_JOBS
        FROM USER U
        INNER JOIN CODES ROLE_CODE ON ROLE_CODE.DOMAIN = 'USER_ROLE' AND ROLE_CODE.CODE = U.ROLE
        LEFT JOIN JOB J ON J.USERID = U.ID
        GROUP BY U.id, U.userName, U.name, U.email, U.ROLE, ROLE_CODE.DESCRIPTION 
        ORDER BY U.NAME ASC
    `;
    connection.query(query, function (err, rows) {
        if (err) {
            console.log(err)
            response.json({users: [] });
        } else {
            response.json({users: rows });
        }
    });
}

module.exports.createUser = (request, response) => {
    let connection = mysql.createConnection(options);
    connection.connect();
    let query = "INSERT INTO user (userName, name, email, password, role) VALUES (?, ?, ?, ?, ?)";
    connection.query(query, [request.body.name, request.body.userName, request.body.email, request.body.password, request.body.role], function (err, rows) {
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

module.exports.editUser = (request, response) => {
    let connection = mysql.createConnection(options);
    connection.connect();
    let query = "UPDATE user SET name = ?, email = ?, role = ? WHERE ID = ?";
    connection.query(query, [request.body.name, request.body.email, request.body.role, request.body.id], function (err, rows) {
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

module.exports.deleteUser = (request, response) => {
    let connection = mysql.createConnection(options);
    connection.connect();
    let query = "DELETE FROM user WHERE id = ?";
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

module.exports.getPageSettings = (request, response) => {
    let connection = mysql.createConnection(options);
    connection.connect();
    let query1 = `SELECT * FROM CODES WHERE DOMAIN = 'USER_ROLE' ORDER BY DISPLAY_ORDER ASC`;

    connection.query(`${query1}`, function (err, results) {
        if (err) {
            console.log(err)
            response.json({pageSettings: [] });
        } else {
            response.json({pageSettings: [results] });
        }
    });
}
