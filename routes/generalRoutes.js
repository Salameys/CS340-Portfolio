const sqlFunctions = require('./sqlFunctions');

var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    var context = {
        title: "Beastidex"
    };
  res.render('home',context);
});

router.get('/index',function(req,res,next){
    var context = {
        title: "Beastidex"
    };
    res.render('home',context);
});

router.get('/biomes', function (req, res) {
  let context = {
      title:"Biomes",
      description:"Biomes are a way to describe the regions of the world, different monsters are found in an area depending on its biome."
    };
  res.render('biomes', context);
});

router.get('/abilities', function (req, res) {
    let context = {
        title:"Abilities",
        description:"Abilities are an important aspect differentiating how characters experience different monsters. Monsters may have any number of abilities."
    };
    res.render('abilities', context)
});

router.get('/elementList', function (req, res) {
  let context = {layout:false}
  let table = req.get('table');
  let partial = req.get('partial');

  let where = false;
  if(req.get('attributeKey')) {
      where = req.get('attributeKey') + '=' + req.get('attributeValue');
  }

  let orderBy = false;
  if(req.get('orderBy')) {
      orderBy = req.get('orderBy');
  }
  
  sqlFunctions.getTable(table, where, orderBy).then(function (elements) {
    table = table.toLowerCase();
    context[table] = elements;
    res.render('partials/' + partial, context);
  });
})

router.get('/elementDisplay', function (req, res) {
    let context = { layout: false };
    let table = req.get('table');
    let partial = req.get('partial');
    let attributeKey = req.get('attributeKey');
    let attributeValue = req.get('attributeValue');
    let mode = req.get('mode');
    if (mode == 'add') {
        sqlFunctions.getTable(table).then(function (elements) {
            context[attributeKey] = elements[0][attributeKey];
            context['add'] = true;
            res.render('partials/' + partial, context);
        });
    } else {
        sqlFunctions.getTable(table, attributeKey + "=" + attributeValue).then(function (element) {
            for (let key in element[0]) {
                context[key] = element[0][key];
            }
            res.render('partials/' + partial, context);
        });
    }
});

/*
* Unsure if this is still necessary
*/
router.delete('/delete_relationship', function (req, res) {
    return new Promise(function (resolve, reject) {
        let characterID = req.get('characterID');
        let monsterID = req.get('monsterID');

        let queryString = 'DELETE FROM Character_Monster';
        queryString += ' WHERE characterID=' + characterID;
        queryString += ' AND monsterID=' + monsterID;
        console.log(queryString);

        mysql.pool.query(queryString, function (err, rows, fields) {
            if (err) {
                reject(Error(err))
            } else {
                resolve(JSON.parse(JSON.stringify(rows)));
            }
        });
    })
});

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