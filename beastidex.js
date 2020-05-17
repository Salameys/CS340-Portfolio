var express = require('express');
var mysql = require('./dbcon.js');
var path=require('path');

var app = express();
var handlebars = require('express-handlebars').create({
  defaultLayout:'main',
  partialsDir: ['views/partials/'],
  helpers: {}
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

app.get('/monsters', function (req, res) {
  let context = {}
  //Retrieves the character table and uses it as context to render /characters
  getTable('Monsters').then(function (monsters) {
    context.title = 'Monsters';
    context.monsters= monsters;
    
    //Render the characters page
    res.render('monsters', context)
  });
});

app.get('/characters', function (req, res) {
  let context = {}
  //Retrieves the character table and uses it as context to render /characters
  getTable('Characters').then(function (characters) {
    context.title = 'Characters';
    context.characters= characters;
    
    //Adds the party attribute to each character for initial page load
    context.characters.forEach(character => {
      getTable('Parties', 'partyID=' + character.partyID).then(function (party) {
        character.party = party[0].name;
      });
    });

    //Render the characters page
    res.render('characters', context)
  });
});

app.get('/abilities', function (req, res) {
  let context = {};
  getTable('Characters').then(function (characters) {
    context.title = 'Characters';
    context.characters= characters;
    
    context.characters.forEach(character => {
      getTable('Parties', 'partyID=' + character.partyID).then(function (party) {
        character.party = party[0].name;
      });
    });

    //Render the characters page
    res.render('characterTest', context)
  });
});

app.get('/characterDisplay', function (req, res) {
  let context = {layout:false};
  let characterID = req.get('characterID');
  context['mode'] = req.get('mode');
  
  if(context['mode'] == "add") res.render('characterModify', context);
  
  getTable('Characters', 'characterID=' + characterID).then(function (character) {
    for(let key in character[0]) {
      console.log(key);
      context[key] = character[0][key];
    }
    context.monsters = [{name:'Jeffasaurus'}, {name:'Cat'}]
    if(context['mode'] == "display") res.render('characterDisplay', context);
    if(context['mode'] == "modify") res.render('characterModify', context);
  });
});

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
