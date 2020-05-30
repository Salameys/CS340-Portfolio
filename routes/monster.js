const sqlFunctions = require('./sqlFunctions');

var express = require('express');
var router = express.Router();

router.get('/monsters', function (req, res) {
  let context = {title:"Monsters"};
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
            let biome = context["allBiomes"].find(biome => biome.monsterID == biomes[i].abilityID);
            context["biomes"].push(biome);
          }
          if(mode == "display") res.render('partials/monsterDisplay', context);
          if(mode == "modify") res.render('partials/monsterModify', context);
      }))
    }
  });
});

module.exports = router;