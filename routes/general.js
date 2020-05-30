const sqlFunctions = require('./sqlFunctions');

var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
  var context = {};
  context.title = "Beastidex";
  res.render('home',context);
});

router.get('/index',function(req,res,next){
  var context = {};
  context.title = "Beastidex";
  res.render('home',context);
});

router.get('/biomes', function (req, res) {
  let context = {title:"Biomes"};
  res.render('biomes', context);
});

router.get('/abilities', function (req, res) {
  let context = {title:"Abilities"};
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

module.exports = router;