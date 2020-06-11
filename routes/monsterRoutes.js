const sqlFunctions = require('./sqlFunctions');

var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');

/**
 * Route to display the monsters page
 */
router.get('/monsters', function (req, res) {
  let context = {
    title:"Monsters",
    description:"Monsters are the primary form of challenge in the world. In addition to their vital statistics, monsters may have any number of abilities and can be found in any number of biomes."
  };
  res.render('monsters', context)
});

/**
 * Route to display all data for a selected monster
 */

router.get('/monsterDisplay', function (req, res) {
  context = {layout:false};
  let monsterID = req.get('monsterID');
  let mode = req.get('mode');

  sqlFunctions.getTable('Abilities', false, "name").then(function (abilities) {
    context['allAbilities'] = abilities;
  })
  .then(sqlFunctions.getTable('Biomes', false, "name").then(function (biomes) {
    context['allBiomes'] = biomes;
  }))
  .then(function () {
    if(mode =="add") {
      sqlFunctions.getTable('Monsters').then(function (monsters) {
        context['monsterID'] = monsters[0].monsterID;
        context['add'] = true;
        res.render('partials/monsterModify', context);
      })
    } else {
      sqlFunctions.getTable('Monsters', 'monsterID=' + monsterID).then(function (monster) {
        for(let key in monster[0]) {
          context[key] = monster[0][key];
        }
        sqlFunctions.getTable('Monster_Ability', 'monsterID=' + monsterID).then(function (abilities) {
          context['abilities'] = [];
          for (i = 0; i < abilities.length; i++) {
            let ability = context['allAbilities'].find(ability => ability.abilityID == abilities[i].abilityID);
            context["abilities"].push(ability);
          }
          sqlFunctions.getTable('Monster_Biome', 'monsterID=' + monsterID).then(function (biomes) {
            context['biomes'] = [];
            for (i = 0; i < biomes.length; i++) {
              let biome = context["allBiomes"].find(biome => biome.biomeID == biomes[i].biomeID);
              context["biomes"].push(biome);
            }
            if(mode == "display") res.render('partials/monsterDisplay', context);
            if(mode == "modify") res.render('partials/monsterModify', context);
          });
        });
      });
    }
  });
});

/**
 * Route to insert a monster into a table within the database as a JSON
 */ 
router.post('/monsterInsert', function (req, res) {
  let monster = JSON.parse(req.get('monster'));
  let abilities = monster.abilities;
  let biomes = monster.biomes;
  delete monster.abilities;
  delete monster.biomes;

  sqlFunctions.insertIntoTable('Monsters', monster).then(function (response) {
    monster.monsterID = response.insertId;
    abilities.forEach(ability => {
      sqlFunctions.insertIntoTable('Monster_Ability', {monsterID:monster.monsterID, abilityID:ability});
    });

    biomes.forEach(biome => {
      sqlFunctions.insertIntoTable('Monster_Biome', {monsterID:monster.monsterID, biomeID:biome});
    });
    
    res.json(response);
  });
});

/**
 * Updates a monster in the database with the given data in the header
 */
router.post('/monsterModify', function (req, res) {
  let monster = JSON.parse(req.get('monster'));
  let abilities = sqlFunctions.parseStringArrayToInt(monster.abilities);
  let biomes = sqlFunctions.parseStringArrayToInt(monster.biomes);
  delete monster.abilities;
  delete monster.biomes;

  console.log(abilities);
  console.log(biomes);

  sqlFunctions.updateTable('Monsters', 'monsterID', monster.monsterID, monster).then(function () {
  });

  sqlFunctions.getTable('Monster_Ability', "monsterID=" + monster.monsterID).then(function (response) {
    oldAbilities = [];
    response.forEach(relationship => {
      oldAbilities.push(Number.parseInt(relationship.abilityID));
    });

    oldAbilities.forEach(oldAbility => {
      if(!abilities.includes(oldAbility)) {
        console.log("Deleting abilityID " + oldAbility);
        mysql.pool.query('DELETE FROM Monster_Ability WHERE monsterID=' + monster.monsterID + " AND abilityID=" + oldAbility);
      };
    });
    
    abilities.forEach(ability => {
      if(!oldAbilities.includes(ability)) {
        console.log("Adding abilityID " + ability);
        sqlFunctions.insertIntoTable('Monster_Ability', {monsterID:monster.monsterID, abilityID:ability});
      }
    });
  });

  sqlFunctions.getTable('Monster_Biome', "monsterID=" + monster.monsterID).then(function (response) {
    oldBiomes = [];
    response.forEach(relationship => {
      oldBiomes.push(Number.parseInt(relationship.biomeID));
    });
    console.log(oldBiomes);

    oldBiomes.forEach(oldBiome => {
      if(!biomes.includes(oldBiome)) {
        console.log("Deleting biomeID " + oldBiome);
        mysql.pool.query('DELETE FROM Monster_Biome WHERE monsterID=' + monster.monsterID + " AND biomeID=" + oldBiome);
      }
    });
    
    biomes.forEach(biome => {
      if(!oldBiomes.includes(biome)) {
        console.log("Adding biomeID " + biome);
        sqlFunctions.insertIntoTable('Monster_Biome', {monsterID:monster.monsterID, biomeID:biome});
      }
    });
  });

  res.json(monster);
});

module.exports = router;