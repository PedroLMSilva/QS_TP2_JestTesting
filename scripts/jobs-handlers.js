"use strict";
const mysql = require("mysql2");
const options = require("./connection-options.json");

module.exports.getListJobs = (request, response) => {
    const {type, identifier} = request.body;
    let connection = mysql.createConnection(options);
    connection.connect();
    let query = `
        SELECT J.ID AS JOB_ID, J.USERID AS USER_ID_CREATED, USER_CREATION.NAME AS USER_NAME_CREATED, 
        J.EQUIPMENT_TYPE, J.EQUIPMENT_BRAND, EQUIPMENT_BRAND_CODE.DESCRIPTION AS EQUIPMENT_BRAND_DESCRIPTION,
        CASE WHEN J.EQUIPMENT_TYPE = '100' THEN J.EQUIPMENT_TYPE_OTHER ELSE EQUIPMENT_TYPE.DESCRIPTION END AS EQUIPMENT_TYPE_DESCRIPTION,
        J.EQUIPMENT_PROCEDURE,
        CASE WHEN J.EQUIPMENT_PROCEDURE = '100' THEN J.EQUIPMENT_PROCEDURE_OTHER ELSE EQUIPMENT_PROCEDURE.DESCRIPTION END AS EQUIPMENT_PROCEDURE_DESCRIPTION,
        UPPER(DATE_FORMAT(J.DATESTARTED, '%d-%b-%Y %H:%i')) AS DATE_STARTED,
        STATUS_CODE.CODE AS STATUS_PROGRESS_CODE,
        STATUS_CODE.DESCRIPTION AS STATUS_PROGRESS_DESCRIPTION,
        COALESCE(UPPER(DATE_FORMAT(J.DATEFINISHED, '%d-%b-%Y %H:%i')), '-') AS DATE_FINISHED,
        USER_FINALISED.NAME AS USER_FINALISED,
        COALESCE(NOTES, '-') AS NOTES, 
        PRIORITY_CODE.CODE AS PRIORITY_CODE, PRIORITY_CODE.DESCRIPTION AS PRIORITY_DESCRIPTION, COALESCE(J.Priority_Work, 1) AS PRIORITY_WORK,
        CLI.NAME AS CLIENT_NAME, CLI.EMAIL AS CLIENT_EMAIL, CLI.NIF AS CLIENT_NIF
        FROM JOB J
        LEFT JOIN USER USER_FINALISED ON USER_FINALISED.ID = J.USERIDFINALISED
        INNER JOIN USER USER_CREATION ON USER_CREATION.ID = J.USERID
        INNER JOIN CODES EQUIPMENT_BRAND_CODE ON EQUIPMENT_BRAND_CODE.DOMAIN = 'JOB_BRAND' AND EQUIPMENT_BRAND_CODE.CODE = J.EQUIPMENT_BRAND
        INNER JOIN CODES STATUS_CODE ON STATUS_CODE.DOMAIN = 'JOB_STATUS' AND STATUS_CODE.CODE = J.STATUS
        INNER JOIN CODES PRIORITY_CODE ON PRIORITY_CODE.DOMAIN = 'JOB_PRIORITY' AND PRIORITY_CODE.CODE = J.PRIORITY
        INNER JOIN CODES EQUIPMENT_TYPE ON EQUIPMENT_TYPE.DOMAIN = 'JOB_EQUIPEMENT' AND EQUIPMENT_TYPE.CODE = J.EQUIPMENT_TYPE
        INNER JOIN CODES EQUIPMENT_PROCEDURE ON EQUIPMENT_PROCEDURE.DOMAIN = 'JOB_EQUIPEMENT_PROCEDURE' AND EQUIPMENT_PROCEDURE.CODE = J.EQUIPMENT_PROCEDURE
        INNER JOIN CLIENT CLI ON CLI.ID = J.USERIDCLIENT`;

    let vaiablesToBind = [];

    if (type === "ME") {
        query += ` WHERE J.USERID = ? AND J.STATUS != '4'
                   ORDER BY CAST(PRIORITY_CODE.CODE AS SIGNED) ASC, COALESCE(J.Priority_Work, 1) ASC`;
        vaiablesToBind.push(identifier);
    }
    else if (type === "ALL") {
        query += ` WHERE J.STATUS != '4'
                   ORDER BY CAST(PRIORITY_CODE.CODE AS SIGNED) ASC, COALESCE(J.Priority_Work, 1) ASC`;
    }
    else
    {
        query += ` WHERE J.STATUS = ?
                   ORDER BY CAST(PRIORITY_CODE.CODE AS SIGNED) ASC, COALESCE(J.Priority_Work, 1) ASC`;
        vaiablesToBind.push(type);
    }

    connection.query(query, vaiablesToBind, function (err, rows) {
        if (err) {
            console.log(err)
            response.json({jobs: [] });
        } else {
            response.json({jobs: rows });
        }
    });
}

module.exports.getUserInfoInitState = (request, response) => {
    let connection = mysql.createConnection(options);
    connection.connect();
    let query1 = `SELECT * FROM CODES WHERE DOMAIN = 'JOB_STATUS' ORDER BY DISPLAY_ORDER ASC`;
    let query2 = `SELECT * FROM CODES WHERE DOMAIN = 'JOB_EQUIPEMENT' ORDER BY DISPLAY_ORDER ASC`;
    let query3 = `SELECT * FROM CODES WHERE DOMAIN = 'JOB_EQUIPEMENT_PROCEDURE' ORDER BY DISPLAY_ORDER ASC`;
    let query4 = `SELECT * FROM CODES WHERE DOMAIN = 'JOB_BRAND' ORDER BY DISPLAY_ORDER ASC`;
    let query5 = `SELECT ID, NAME FROM CLIENT`;
    let query6 = `SELECT * FROM CODES WHERE DOMAIN = 'JOB_PRIORITY' ORDER BY DISPLAY_ORDER ASC`;

    connection.query(`${query1}; ${query2}; ${query3}; ${query4}; ${query5}; ${query6}`, function (err, results) {
        if (err) {
            console.log(err)
            response.json({initPageState: [] });
        } else {
            response.json({initPageState: results });
        }
    });
}

module.exports.editJobInfo = (request, response) => {
    const {id, userId, status, equipmentType, equipmentTypeOther, equipmentProcedure, equipmentProcedureOther, equipmentBrand, notes, priority} = request.body;   

    let connection = mysql.createConnection(options);
    connection.connect();
    
    let query = `SELECT
        MAX(Priority_Work) AS PRIORITY_NUMBER,
        COUNT(*) AS TOTAL_JOBS
        FROM JOB WHERE PRIORITY = ?`;
    
    connection.query(query, [priority], function (err, result) {
        if (err) {
            console.log(err)
            response.sendStatus(500);
            return;
        } 
        
        let priorityWork = result[0].PRIORITY_NUMBER;
        if (priorityWork === null) {
            priorityWork = 1;
        }
        else
        {
            priorityWork++;
        }

        let priorityWorkTotal = result[0].TOTAL_JOBS;

        if (priorityWorkTotal === 1) {
            priorityWork = 1;
        }

        query = `UPDATE JOB SET Equipment_Type = ?, Equipment_Type_Other = ?, Equipment_Procedure = ?, 
                 Equipment_Procedure_Other = ?, Notes = ?, Status = ?, Equipment_Brand = ?, Priority = ?, Priority_Work = ? WHERE ID = ?`;

        let parameters = [equipmentType, equipmentTypeOther, equipmentProcedure, equipmentProcedureOther,
            notes, status, equipmentBrand, priority, priorityWork, id];

        if (status === "4") {
            query = `UPDATE JOB SET Equipment_Type = ?, Equipment_Type_Other = ?, Equipment_Procedure = ?, 
                Equipment_Procedure_Other = ?, Notes = ?, Status = ?, Equipment_Brand = ?, Priority = ?, Priority_Work = ?,
                DateFinished = ?, USERIDFINALISED = ? WHERE ID = ?`;

            const dateFinalised = new Date().toISOString().slice(0, 19).replace('T', ' ');
            parameters = [equipmentType, equipmentTypeOther, equipmentProcedure, equipmentProcedureOther,
                notes, status, equipmentBrand, priority, priorityWork, dateFinalised, userId, id];
        }

        connection.query(query, parameters, function (err, rows) {
            if (err) {
                console.log(err)
                response.sendStatus(500);
            } 
            else 
            {
                response.sendStatus(200);
            }
        });

    });
}

module.exports.createJob = (request, response) => {
    const {userId, userIdClient, status, equipmentType, equipmentTypeOther, equipmentProcedure, equipmentProcedureOther, equipmentBrand, notes, priority} = request.body;
        
    let connection = mysql.createConnection(options);
    connection.connect();

    let query = "SELECT MAX(Priority_Work) AS PRIORITY_NUMBER FROM JOB WHERE PRIORITY = ?";
    
    connection.query(query, [priority], function (err, result) {
        if (err) {
            console.log(err);
            response.sendStatus(500);
            return;
        } 

        let priorityWork = result[0].PRIORITY_NUMBER;
        if (priorityWork === null) {
            priorityWork = 1;
        }
        else
        {
            priorityWork++;
        }
        
        const dateStarted = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
        query = `
            INSERT INTO JOB (USERID, USERIDCLIENT, EQUIPMENT_TYPE, EQUIPMENT_TYPE_OTHER, EQUIPMENT_BRAND, EQUIPMENT_PROCEDURE, EQUIPMENT_PROCEDURE_OTHER, DATESTARTED, STATUS, NOTES, Priority, Priority_Work) 
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(query, [userId, userIdClient, equipmentType, equipmentTypeOther, equipmentBrand, equipmentProcedure, equipmentProcedureOther, dateStarted, status, notes, priority, priorityWork], function (err, rows) {
            if (err) {
                console.log(err);
                response.sendStatus(500);
                return;
            } 
            response.sendStatus(200);
        });
    });
}

module.exports.reopenJob = (request, response) => {
    const {JobId} = request.body;
    let connection = mysql.createConnection(options);
    connection.connect();
    let query = `UPDATE JOB SET STATUS = ?, DATEFINISHED = ?, USERIDFINALISED = ? WHERE ID = ?`;

    connection.query(query, ["1", null, null, JobId], function (err, rows) {
        if (err) {
            console.log(err)
            response.sendStatus(500);
        } else {
            response.sendStatus(200);
        }
    });
}

module.exports.editOrderPriority = (request, response) => {
    const { startRowInfo, endRowInfo } = request.body;

    let connection = mysql.createConnection(options);
    connection.connect();

    let query1 = `UPDATE JOB SET Priority_Work = ? WHERE ID = ?`;
    let query2 = `UPDATE JOB SET Priority_Work = ? WHERE ID = ?`;

    //console.log(startRowInfo, endRowInfo);

    connection.query(`${query1}; ${query2}`, [startRowInfo.priorityWork, endRowInfo.id, endRowInfo.priorityWork, startRowInfo.id], function (err, results) {
        if (err) {
            console.log(err)
            response.sendStatus(500);
            return;
        } 
        response.sendStatus(200);
    });
}
