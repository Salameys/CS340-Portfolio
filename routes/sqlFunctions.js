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
 * 
 * @param {string} table Name of table in database
 * @param {Object} element JSON object 
 */
function insertIntoTable (table, element) {
return new Promise(function(resolve, reject) {
    let keys = [];
    let values = [];
    let queryString = '';

    for (let key in element) {
        keys.push(key);
        values.push('"' + element[key] + '"');
    }

    queryString = "INSERT INTO " + table;
    queryString += "(`" + keys.join("`,`") + "`) ";
    queryString += "VALUES (" + values.join(",") + ");";
    console.log(queryString);

    mysql.pool.query(queryString, function (err, rows, fields) {
        if (err) {
            reject(Error(err))
        } else {
            resolve(rows);
        }
    });
});
};

/**
 * Updates all passed key/value pairs of an element in a given table. It is
 * safe to pass the elementID key/value pair so long as they are unchanged.
 * @param {string} table Name of table in database
 * @param {string} attributeKey Name of ID attribute
 * @param {string} attributeValue Value of ID attribute
 * @param {Object} element Object containing element data
 */
function updateTable(table, attributeKey, attributeValue, element) {
    return new Promise(function (resolve, reject) {
        let keys = [];
        let values = [];
        let queryString = '';

        for (let key in element) {
            keys.push(key);
            if(element[key] == null) {
                values.push("null");
            } else {
                values.push('"' + element[key] + '"');
            }
        }

        queryString = "UPDATE " + table;
        queryString += " SET "
        //For loop so that the proper keys and values are matched up
        for (i = 0; i < keys.length; i++) {
            queryString += keys[i] + '=' + values[i];
            //If/else used to ensure proper SQL syntax
            if ((i+1) < keys.length) {
                queryString += ', ';
            }
        }
        queryString += " WHERE " + attributeKey;
        queryString += "=" + attributeValue;
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
 * Converts an array of numbers saved as strings into Number primatives
 * @param {Array} array 
 */
function parseStringArrayToInt(array) {
    let outcart = [];
    array.forEach(index => {
        outcart.push(Number.parseInt(index));
    })
    return outcart;
}

  module.exports = {getTable, insertIntoTable, updateTable, parseStringArrayToInt};