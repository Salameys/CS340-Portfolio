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

  module.exports = {getTable, insertIntoTable};