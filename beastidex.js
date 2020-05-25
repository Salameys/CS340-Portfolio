var express = require('express');
var mysql = require('./dbcon.js');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({
  defaultLayout:'main',
  partialsDir: ['views/partials/'],
  helpers: {
    equal: function (left, right) { return (left == right)}
  }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('images'));

app.get('/',function(req,res,next){
  var context = {};
  context.title = "Beastidex";
  res.render('home',context);
});

app.get('/index',function(req,res,next){
  var context = {};
  context.title = "Beastidex";
  res.render('home',context);
});

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
var insertIntoTable = function (table, body) {
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


/**
 * Route to retrieve any database table as a JSON
 * @param {string} table name of database table
 * @param {string} attributeKey attribute key to filter by
 * @param {string} attributeValue attribute value to filter by
 * @param {string} orderBy attribute to order by
 */
app.get('/table', function (req, res) {
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

    getTable(table, where, orderBy).then(function (elements) {
        res.json(elements);
    }); 

});

app.get('/searchQuery', function (req, res) {
    let table = req.get('table');
    let element = req.get('element');

});

app.post('/table_insert', function (req, res) {
    let table = req.get('table');
    let element = JSON.parse(req.get('element'));

    insertIntoTable(table, element).then(function (response) {
        console.log(response);
        res.json(response);
    });

});

app.post('/table_modify', function (req, res) {
  let table = req.get('table');
  let element = req.get('element');
});

app.get('/monsters', function (req, res) {
  let context = {title:"Monsters"};
  res.render('monsters', context)
});

app.get('/characters', function (req, res) {
  let context = {title:"Characters"};
  res.render('characters', context)
});

app.get('/biomes', function (req, res) {
  let context = {title:"Biomes"};
  res.render('biomes', context);
});

app.get('/abilities', function (req, res) {
  let context = {title:"Abilities"};
  res.render('abilities', context)
});

app.get('/parties', function (req, res) {
  let context = {title:"Parties"};
  res.render('parties', context)
});

app.get('/elementList', function (req, res) {
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
  
  getTable(table, where, orderBy).then(function (elements) {
    table = table.toLowerCase();
    context[table] = elements;
    res.render('partials/' + partial, context);
  });
})

app.get('/elementDisplay', function (req, res) {
  let context = {layout:false}
  let table = req.get('table');
  let partial = req.get('partial');
  let attributeKey = req.get('attributeKey');
  let attributeValue = req.get('attributeValue');
  getTable(table, attributeKey + "=" + attributeValue).then(function (element) {
    for(let key in element[0]) {
      context[key] = element[0][key];
    }
    res.render('partials/' + partial, context);
  });
});

app.get('/characterList', function (req, res) {
  let context = {layout:false};

  let where = false;
  if(req.get('attributeKey')) {
      where = req.get('attributeKey') + '=' + req.get('attributeValue');
  }

  let orderBy = false;
  if(req.get('orderBy')) {
      orderBy = req.get('orderBy');
  }

  getTable('Characters', where, orderBy).then(function (characters) {
    context.characters = characters;
    
    context.characters.forEach(character => {
      if(character.partyID != null && character.partyID) {
        getTable('Parties', 'partyID=' + character.partyID).then(function (party) {
          character.party = party[0].name;
        });
      }
    });

    res.render('partials/characterList', context);
  });
});

app.get('/characterDisplay', function (req, res) {
  let context = {layout:false};
  let characterID = req.get('characterID');
  let mode = req.get('mode');
  
  //Load list of all monsters
  getTable('Monsters', false, "name").then(function (monsters) {
    context['allMonsters'] = monsters;
  })

  //Load list of all parties
  .then(getTable('Parties', false, "name").then(function (parties) {
    context["parties"] = parties;
  }))

  //Actually do stuff
  .then(function () {
    //Render the add table with the first character of the table for reference if cancelled
    if(mode == "add") {
      getTable('Characters').then(function (characters) {
        context['characterID'] = characters[0].characterID;
        context['add'] = true;
        res.render('partials/characterModify', context);
      });
    }
    //Display or modify table with provided characterID reference
    else { 
      //Populate party name via party ID
      getTable('Characters', 'characterID=' + characterID).then(function (character) {
        for(let key in character[0]) {
          context[key] = character[0][key];
        }
        if(context.partyID) {
          context.party = context["parties"].find(party => party.partyID = context.partyID).name;
        }
      })
      //Load list of monsters encountered and replace monsterIDs with monster objects
      .then(getTable('Character_Monster', "characterID=" + characterID).then(function(monsters) {
        context["monsters"] = [];
        for (i = 0; i < monsters.length; i++) {
          let monster = context["allMonsters"].find(monster => monster.monsterID == monsters[i].monsterID);
          context["monsters"].push(monster);
        }
        if(mode == "display") res.render('partials/characterDisplay', context);
        if(mode == "modify") res.render('partials/characterModify', context);
      }));
    }
  });
});

app.get('/monsterDisplay', function (req, res) {
  context = {layout:false};
  let monsterID = req.get('monsterID');
  let mode = req.get('mode');

  getTable('Abilities', false, "name").then(function (abilities) {
    context['allAbilities'] = abilities;
  })
  .then(getTable('Biomes', false, "name").then(function (biomes) {
    context['allBiomes'] = biomes;
  }))
  .then(function () {
    if(mode =="add") {
      getTable('Monsters').then(function (monsters) {
        context['monsterID'] = monsters[0].monsterID;
        context['add'] = true;
        res.render('partials/monsterModify', context);
      })
    }
    else {
      getTable('Monsters', 'monsterID=' + monsterID).then(function (monster) {
        for(let key in monster[0]) {
          context[key] = monster[0][key];
        }
      })
      .then(getTable('Monster_Ability', 'monsterID=' + monsterID).then(function (abilities) {
        context['abilities'] = [];
        for (i = 0; i < abilities.length; i++) {
          let ability = context['allAbilities'].find(ability => ability.abilityID == abilities[i].abilityID);
          context["abilities"].push(ability);
        }
      }))
      .then(getTable('Monster_Biome', 'monsterID=' + monsterID).then(function (biomes) {
          context['biomes'] = [];
          for (i = 0; i < biomes.length; i++) {
            let biome = context["allBiomes"].find(biome => biome.monsterID == biomes[i].abilityID);
            context["biomes"].push(biome);
          }
          if(mode == "display") res.render('partials/monsterDisplay', context);
          if(mode == "modify") res.render('partials/monsterModify', context);
      }))
    }
  });
});

app.get('/partyList', function (req, res) {
  context = {layout: false};

  getTable('Parties', false, "name").then(function (parties) {
    context['parties'] = parties;
    context['parties'].forEach(
      party => party['members'] = 0
    );
  }).then(getTable('Characters', false).then(function (characters) {
    characters.forEach(character => {
      if(character.partyID) {
        try {
          let party = context['parties'].find(party => party.partyID == character.partyID);
          party['members'] += 1;
        }
        catch (err) {
          console.log(character.name + " has no party.");
        }
      }
    });
    res.render('partials/partyList', context);
  }));
});

app.get('/partyDisplay', function (req, res) {
  context = {layout: false};
  let partyID = req.get("partyID");
  let mode = req.get('mode');

  getTable('Characters').then(function (characters) {
    context['allCharacters'] = characters;

    if(mode == "add") {
      getTable('Parties').then(function (parties) {
        context['partyID'] = parties[0].partyID;
        context['add'] = true;
        res.render('partials/partyModify', context);
      });
    } else {
      getTable('Parties', "partyID=" + partyID).then(function (party) {
        for(let key in party[0]) {
          context[key] = party[0][key];
        }
      }).then(getTable('Characters', "partyID=" + partyID, "name").then(function (characters) {
        context['characters'] = characters;
        if(mode == "modify") res.render('partials/partyModify', context);
        if(mode == "display") res.render('partials/partyDisplay', context);
      }));
    }
  })
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
