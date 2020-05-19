var express = require('express');
var mysql = require('./dbcon.js');
var path=require('path');

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
 * Route to retrieve any database table as a JSON
 * @param {string} table name of database table
 * @param {string} attributeKey attribute key to filter by
 * @param {string} attributeValue attribute value to filter by
 * @param {string} orderBy attribute to order by
 */
app.get('/table', function (req, res) {
  let table = req.get('dataTable');

  let where = false;
  if(req.get('attributeKey')) {
    where = req.get('attributeKey') + '=' + req.get('attributeValue');
  }

  let orderBy = false;
  if(req.get('orderBy')) {
    orderBy = req.get('orderBy');
  }

  getTable(table, where, orderBy).then(function (characters) {
    res.json(characters);
  });
});

app.post('/table_insert', function (req, res) {
  let table = req.get('dataTable');
  let element = req.get('element');
});

app.post('/table_modify', function (req, res) {
  let table = req.get('dataTable');
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
  getTable(table).then(function (elements) {
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
  getTable('Characters').then(function (characters) {
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

/*
app.get('/monsters',function(req,res,next){
  var context = {};
  context.monsters = [
    {
      monsterID:1, name:"Jeffasaurus", description:"Part Jeff, part saurus. All ready to rock.",
      type:"Dinosaur", alignment:"CN",
      armor_class:8, hit_dice:"4d6", speed:30,
      strength:18, dexterity:8, constitution:16,
      intelligence:10, wisdom:8, charisma:20,
      challenge:5, source:"Derp"
    },
    {
      monsterID:2, name:"Beezle Bub", description:"Gonna take you to heck, bub.",
      type:"Demon", alignment:"LE",
      armor_class:16, hit_dice:"4d8", speed:30,
      strength:14, dexterity:12, constitution:16,
      intelligence:15, wisdom:13, charisma:15,
      challenge:8, source:"Derp"
    },
    {
      monsterID:3, name:"Cat", description:"Meow.",
      type:"Animal", alignment:"CE",
      armor_class:2, hit_dice:"2d6", speed:30,
      strength:6, dexterity:14, constitution:7,
      intelligence:7, wisdom:8, charisma:18,
      challenge:5, source:"Life"
    },
    {
      monsterID:4, name:"Rory", description:"Been through so much time and back.",
      type:"Human", alignment:"LG",
      armor_class:14, hit_dice:"4d12", speed:30,
      strength:12, dexterity:11, constitution:22,
      intelligence:14, wisdom:9, charisma:12,
      challenge:10, source:"Dr Who"
    }
  ];

  context.title = "Monsters";
  res.render('monsters',context);
});

app.get('/monster_abilities', function (req, res, next) {
    var context = {};
    context.monster_abilities = [
        { abilityID: 1, name: "Bite" },
        { abilityID: 2, name: "Claws" },
    ];

    res.json(context);
});

app.get('/monster_biomes', function (req, res, next) {
    var context = {};
    context.monster_biomes = [
        { biomeID: 1, name: "Desert" },
        { biomeID: 2, name: "Jungle" },
    ];

    res.json(context);
});

app.get('/characters',function(req,res,next){
  var context = {};
  context.characters = [
    { characterID:1, name:"Robert Sandfield", race:"Human",
      class:"Wizard", level:5, party:"Database Comrades",
      strength:20, dexterity:20, constitution:20,
      intelligence:20, wisdom:20, charisma:20
    },
    { characterID:2, name:"Salah Salamey", race:"Dinosaur",
      class:"Monk", level:5, party:"Database Comrades",
      strength:20, dexterity:20, constitution:20,
      intelligence:20, wisdom:20, charisma:20
    },
    { characterID:3, name:"Jeff O'Saur", race:"Dinosaur",
      class:"Bard", level:3, party:"Derpestarians",
      strength:13, dexterity:8, constitution:15,
      intelligence:11, wisdom:8, charisma:20
    },
    { characterID:4, name:"Bill", race:"Donkey",
      class:"Bourgeoisie", level:8, party:"Derpestarians",
      strength:14, dexterity:8, constitution:15,
      intelligence:7, wisdom:6, charisma:8
    },
    { characterID:5, name:"Shrek", race:"Ogre",
      class:"Fighter", level:6, party:"Shronkey",
      strength:18, dexterity:11, constitution:16,
      intelligence:12, wisdom:9, charisma:8
    },
    { characterID:6, name:"Donkey", race:"Donkey",
      class:"Bard", level:8, party:"Shronkey",
      strength:14, dexterity:8, constitution:15,
      intelligence:11, wisdom:9, charisma:18
    }
  ];

  context.title = "Characters";
  console.log(context);
  res.render('characters',context);
});

app.get('/characters_monsters', function (req, res, next) {
    var context = {};
    context.character_monsters = [
        { monsterID: 1, name: "Jeffasaurus" },
        { monsterID: 2, name: "Beezle Bub" }
    ];

    res.json(context);
});

app.get('/biomes', function (req, res, next) {
    var context = {};
    context.title = "Biomes";
    context.biomes = [
      {biomeID:1, name:"Desert", description:"I don't like the sand. It's coarse and rough and irritating."},
      {biomeID:2, name:"Jungle", description:"Basically the opposite of desert. Still hate it."},
      {biomeID:3, name:"Tundra", description:"Too cold."},
      {biomeID:4, name:"Forest", description:"Shady and smells nice."}
    ];

    res.render('biomes', context);
});

app.get('/abilities', function (req, res, next) {
    var context = {};
    context.title = "Abilities";
    context.abilities = [
      {abilityID:1, name:"Bite", damage_type:"Piercing", range:"Melee", damage_dice:"1d8"},
      {abilityID:2, name:"Claws", damage_type:"Slashing", range:"Melee", damage_dice:"2d4"},
      {abilityID:3, name:"Fire Ray", damage_type:"Fire", range:"30ft", damage_dice:"3d6"},
      {abilityID:4, name:"Slam", damage_type:"Bludgeoning", range:"Melee", damage_dice:"2d6"}
    ];

    res.render('abilities', context);
});


/*
 * Commented below is the idea I had to utilize search without
 * having walls of text
 * (and hopefully other things we will need to do with SQL)
/*
var searchName = function (res, table) {
    var context = {};
    mysql.pool.query('SELECT * FROM' + table, 'WHERE name = ?', function (err, rows, fields) {
        if (err) throw err;
        context.results = rows;
        res.render(context);
    });
};

app.get('/character_name', function (req, res) {
    searchName(res, 'characters');
});
*/

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
