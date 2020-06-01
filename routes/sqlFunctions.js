var mysql = require('../dbcon.js');

/**
 * Gets the SQL table results for a given select
 * @param {string} table data table name
 * @param {string} where optional filter statement
 * @param {string} where optional order by statement
 */
function getTable (table, where = false, orderBy = false) {
    return new Promise(function(resolve, reject) {
      let queryString = 'SELECT * FROM ' + table;
      if(where) queryString += ' WHERE ' + where;
      if(orderBy) queryString += ' ORDER BY ' + orderBy;
      console.log(queryString);
      mysql.pool.query(queryString, function (err, rows, fields) {
        if (err) {
            reject(Error(err))
        } else {
          resolve(JSON.parse(JSON.stringify(rows)));
        }
      });
    });
  };

/**
 * Inserts new row into table
 *
 */
function insertIntoTable (table, body) {
return new Promise(function(resolve, reject) {
    let keys = [];
    let values = [];
    let queryString = '';

    for (let key in body) {
        keys.push(key);
        values.push("'" + body[key] + "'");
    }

    queryString = "INSERT INTO " + table;
    queryString += "(`" + keys.join("`,`") + "`) ";
    queryString += "VALUES (" + values.join(",") + ");";
    console.log(queryString);

    mysql.pool.query(queryString, function (err, rows, fields) {
        if (err) {
            reject(Error(err))
        } else {
            resolve(JSON.parse(JSON.stringify(rows)));
        }
    });
});
};

function updateTable(table, element, elementID, body) {
    return new Promise(function (resolve, reject) {
        let keys = [];
        let values = [];
        let queryString = '';

        for (let key in body) {
            keys.push(key);
            values.push("'" + body[key] + "'");
        }

        queryString = "UPDATE " + table;
        queryString += " SET "
        //For loop so that the proper keys and values are matched up
        //keys.length-1 so the characterID isn't touched
        for (i = 0; i < (keys.length - 1); i++) {
            queryString += keys[i] + '=';
            //If/else used to ensure proper SQL syntax
            if ((i+1) == (keys.length-1)) {
                queryString += values[i];
            }
            else {
                queryString += values[i] + ', ';
            }
        }
        queryString += " WHERE " + element;
        queryString += "=" + elementID;
        console.log(queryString);

        mysql.pool.query(queryString, function (err, rows, fields) {
            if (err) {
                reject(Error(err))
            } else {
                resolve(JSON.parse(JSON.stringify(rows)));
            }
        });
    });
};

  module.exports = {getTable, insertIntoTable, updateTable};