const sqlFunctions = require('./sqlFunctions');

var mysql = require('../dbcon.js');
var express = require('express');
var router = express.Router();

/**
 * Route to retrieve any database table as a JSON
 * @param {string} table name of database table
 * @param {string} attributeKey attribute key to filter by
 * @param {string} attributeValue attribute value to filter by
 * @param {string} orderBy attribute to order by
 */
router.get('/table', function (req, res) {
    let table = req.get('dataTable');
    let elements = req.get('elements');

    let where = false;
    if(req.get('attributeKey')) {
        where = req.get('attributeKey') + '=' + req.get('attributeValue');
    }

    let orderBy = false;
    if(req.get('orderBy')) {
        orderBy = req.get('orderBy');
    }

    sqlFunctions.getTable(table, where, orderBy).then(function (elements) {
        res.json(elements);
    }); 

});

router.post('/table_insert', function (req, res) {
    let table = req.get('table');
    let element = JSON.parse(req.get('element'));

    sqlFunctions.insertIntoTable(table, element).then(function (response) {
        console.log(response);
        res.json(response);
    });

});

router.post('/table_modify', function (req, res) {
    let table = req.get('table');
    let body = req.get('body');
    let element = JSON.parse(req.get('element'));
    let elementID = req.get('elementID');

    sqlFunctions.updateTable(table, element, elementID, body).then(function (response) {
        console.log(response);
        res.json(response);
    });
});

router.delete('/table_delete', function (req, res) {
    return new Promise(function (resolve, reject) {
        let table = req.get('table');
        let element = req.get('element');
        let elementID = req.get('elementID');

        let queryString = 'DELETE FROM ' + table;
        queryString += ' WHERE ' + element + '= ';
        queryString += "'" + elementID + "'";
        console.log(queryString);

        mysql.pool.query(queryString, function (err, rows, fields) {
            if (err) {
                reject(Error(err))
            } else {
                resolve(JSON.parse(JSON.stringify(rows)));
            }
        });
    });
});

module.exports = router;