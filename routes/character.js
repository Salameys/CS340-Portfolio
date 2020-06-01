const sqlFunctions = require('./sqlFunctions');

var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');

router.get('/characters', function (req, res) {
  let context = {
    title:"Characters",
    description:"Characters are the means by which players interact with the world. In addition to their own vital stats, a character may be in a party and may have encountered any number of monsters."
  };
  res.render('characters', context)
});

router.get('/characterList', function (req, res) {
  let context = {layout:false};

  let where = false;
  if(req.get('attributeKey')) {
      where = req.get('attributeKey') + '=' + req.get('attributeValue');
  }

  let orderBy = false;
  if(req.get('orderBy')) {
      orderBy = req.get('orderBy');
  }

  sqlFunctions.getTable('Characters', where, orderBy).then(function (characters) {
    context.characters = characters;
    
    context.characters.forEach(character => {
      if(character.partyID != null && character.partyID) {
        sqlFunctions.getTable('Parties', 'partyID=' + character.partyID).then(function (party) {
          character.party = party[0].name;
        });
      }
    });

    res.render('partials/characterList', context);
  });
});

router.get('/characterDisplay', function (req, res) {
  let context = {layout:false};
  let characterID = req.get('characterID');
  let mode = req.get('mode');
  
  //Load list of all monsters
  sqlFunctions.getTable('Monsters', false, "name").then(function (monsters) {
    context['allMonsters'] = monsters;
  })

  //Load list of all parties
  .then(sqlFunctions.getTable('Parties', false, "name").then(function (parties) {
    context["parties"] = parties;
  }))

  //Actually do stuff
  .then(function () {
    //Render the add table with the first character of the table for reference if cancelled
    if(mode == "add") {
      sqlFunctions.getTable('Characters').then(function (characters) {
        context['characterID'] = characters[0].characterID;
        context['add'] = true;
        res.render('partials/characterModify', context);
      });
    }
    //Display or modify table with provided characterID reference
    else { 
      //Populate party name via party ID
      sqlFunctions.getTable('Characters', 'characterID=' + characterID).then(function (character) {
        for(let key in character[0]) {
          context[key] = character[0][key];
        }
        if(context.partyID) {
          context.party = context["parties"].find(party => party.partyID = context.partyID).name;
        }
      })
      //Load list of monsters encountered and replace monsterIDs with monster objects
      .then(sqlFunctions.getTable('Character_Monster', "characterID=" + characterID).then(function(monsters) {
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

router.post('/characterInsert', function (req, res) {
  let character = JSON.parse(req.get('character'));
  let monsters = character.monsters;
  delete character.monsters;

  sqlFunctions.insertIntoTable('Characters', character).then(function (response) {
      monsters.forEach(monster => {
        sqlFunctions.insertIntoTable('Character_Monster', {characterID:character.characterID, monsterID:monster});
      });
      res.json(response);
  });
});

router.post('/characterModify', function (req, res) {
  let character = JSON.parse(req.get('character'));
  let monsters = character.monsters;
    delete character.monsters;

    sqlFunctions.updateTable('Characters', 'characterID', character.characterID, character).then(function () {
    });

  sqlFunctions.getTable('Character_Monster', "characterID=" + character.characterID).then(function (response) {
    oldMonsters = [];
    response.forEach(relationship => {
      oldMonsters.push(relationship.monsterID);
    });

    oldMonsters.forEach(oldMonster => {
      if(!monsters.includes(oldMonster)) {
        console.log("Deleting " + oldMonster);
        //Delete {characterID:character.characterID, monsterID:oldMonster}
        mysql.pool.query('DELETE FROM Character_Monster WHERE characterID=' + character.characterID + " AND monsterID=" + oldMonster);
      };
    });
    
    monsters.forEach(monster => {
      if(!oldMonsters.includes(monster)) {
        console.log("Adding " + monster);
        sqlFunctions.insertIntoTable('Character_Monster', {characterID:character.characterID, monsterID:monster});
      }
    });
  });

  res.json();
});

module.exports = router;