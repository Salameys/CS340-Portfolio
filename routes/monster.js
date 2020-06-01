const sqlFunctions = require('./sqlFunctions');

var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');

router.get('/monsters', function (req, res) {
  let context = {
    title:"Monsters",
    description:"Monsters are the primary form of challenge in the world. In addition to their vital statistics, monsters may have any number of abilities and can be found in any number of biomes."
  };
  res.render('monsters', context)
});

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
    }
    else {
      sqlFunctions.getTable('Monsters', 'monsterID=' + monsterID).then(function (monster) {
        for(let key in monster[0]) {
          context[key] = monster[0][key];
        }
      })
      .then(sqlFunctions.getTable('Monster_Ability', 'monsterID=' + monsterID).then(function (abilities) {
        context['abilities'] = [];
        for (i = 0; i < abilities.length; i++) {
          let ability = context['allAbilities'].find(ability => ability.abilityID == abilities[i].abilityID);
          context["abilities"].push(ability);
        }
      }))
      .then(sqlFunctions.getTable('Monster_Biome', 'monsterID=' + monsterID).then(function (biomes) {
          context['biomes'] = [];
          for (i = 0; i < biomes.length; i++) {
            let biome = context["allBiomes"].find(biome => biome.monsterID == biomes[i].biomeID);
            context["biomes"].push(biome);
          }
          if(mode == "display") res.render('partials/monsterDisplay', context);
          if(mode == "modify") res.render('partials/monsterModify', context);
      }))
    }
  });
});

router.post('/monsterInsert', function (req, res) {
  let monster = JSON.parse(req.get('monster'));
  let abilities = monster.abilities;
  let biomes = monster.biomes;
  delete mosnter.abilities;
  delete monster.biomes;

  sqlFunctions.insertIntoTable('Monsters', monster).then(function (response) {
    abilities.forEach(ability => {
      sqlFunctions.insertIntoTable('Monster_Ability', {monsterID:monster.monsterID, abilityID:ability});
    });

    biomes.forEach(biome => {
      sqlFunctions.insertIntoTable('Monster_Biome', {monsterID:monster.monsterID, biomeID:biome});
    });
    
    res.json(response);
  });
});

router.post('/monsterModify', function (req, res) {
  let monster = JSON.parse(req.get('monster'));
  let abilities = monster.abilities;
  let biomes = monster.biomes;
  delete monster.abilities;
    delete monster.biomes;

    sqlFunctions.updateTable('Monsters', 'monsterID', monster.monsterID, monster).then(function (response) {
        res.json(response);
    });

  sqlFunctions.getTable('Monster_Ability', "monsterID=" + monster.monsterID).then(function (response) {
    oldAbilities = [];
    response.forEach(relationship => {
      oldAbilities.push(relationship.abilityID);
    });

    oldAbilities.forEach(oldAbility => {
      if(!abilities.includes(oldAbility)) {
        console.log("Deleting " + oldAbility);
        mysql.pool.query('DELETE FROM Monster_Ability WHERE monsterID=' + monster.monsterID + " AND abilityID=" + oldAbility);
      };
    });
    
    abilities.forEach(monster => {
      if(!oldAbilities.includes(ability)) {
        console.log("Adding " + ability);
        sqlFunctions.insertIntoTable('Monster_Ability', {monsterID:monster.monsterID, abilityID:ability});
      }
    });
  });

  sqlFunctions.getTable('Monster_Biome', "monsterID=" + monster.monsterID).then(function (response) {
    oldBiomes = [];
    response.forEach(relationship => {
      oldBiomes.push(relationship.abilityID);
    });

    oldBiomes.forEach(oldBiome => {
      if(!biomes.includes(oldBiome)) {
        console.log("Deleting " + oldBiome);
        mysql.pool.query('DELETE FROM Monster_Biome WHERE monsterID=' + monster.monsterID + " AND biomeID=" + oldBiome);
      };
    });
    
    biomes.forEach(biome => {
      if(!oldBiomes.includes(biome)) {
        console.log("Adding " + biome);
        sqlFunctions.insertIntoTable('Monster_Biome', {monsterID:monster.monsterID, biomeID:biome});
      }
    });
  });

  res.json();
});

module.exports = router;