const sqlFunctions = require('./sqlFunctions');

var express = require('express');
var router = express.Router();

router.get('/parties', function (req, res) {
    let context = {title:"Parties"};
    res.render('parties', context)
  });

router.delete('/delete_party', function (req, res) {
    return new Promise(function (resolve, reject) {
        let partyID = req.get('partyID');

        let updateQuery = 'UPDATE Characters';
        updateQuery += ' SET partyID=NULL'
        updateQuery += ' WHERE partyID=' + partyID;
        console.log(updateQuery);

        mysql.pool.query(updateQuery, function (err, rows, fields) {
            if (err) {
                reject(Error(err))
            } else {
                resolve(JSON.parse(JSON.stringify(rows)));
            }
        });

        let deleteQuery = 'DELETE FROM Parties';
        deleteQuery += ' WHERE partyID=' + partyID;
        console.log(deleteQuery);

        mysql.pool.query(deleteQuery, function (err, rows, fields) {
            if (err) {
                reject(Error(err))
            } else {
                resolve(JSON.parse(JSON.stringify(rows)));
            }
        });

    })
});

router.get('/partyList', function (req, res) {
    context = { layout: false };

    let where = false;
    if (req.get('attributeKey')) {
        where = req.get('attributeKey') + '=' + req.get('attributeValue');
    }

    let orderBy = false;
    if (req.get('orderBy')) {
        orderBy = req.get('orderBy');
    }

  sqlFunctions.getTable('Parties', false, "name").then(function (parties) {
    context['parties'] = parties;
    context['parties'].forEach(
      party => party['members'] = 0
    );
  }).then(sqlFunctions.getTable('Characters', false).then(function (characters) {
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

router.get('/partyDisplay', function (req, res) {
  context = {layout: false};
  let partyID = req.get("partyID");
  let mode = req.get('mode');

  sqlFunctions.getTable('Characters').then(function (characters) {
    context['allCharacters'] = characters;

    if(mode == "add") {
      sqlFunctions.getTable('Parties').then(function (parties) {
        context['partyID'] = parties[0].partyID;
        context['add'] = true;
        res.render('partials/partyModify', context);
      });
    } else {
      sqlFunctions.getTable('Parties', "partyID=" + partyID).then(function (party) {
        for(let key in party[0]) {
          context[key] = party[0][key];
        }
      }).then(sqlFunctions.getTable('Characters', "partyID=" + partyID, "name").then(function (characters) {
        context['characters'] = characters;
        if(mode == "modify") res.render('partials/partyModify', context);
        if(mode == "display") res.render('partials/partyDisplay', context);
      }));
    }
  })
});

  module.exports = router;