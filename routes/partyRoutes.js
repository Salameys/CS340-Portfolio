const sqlFunctions = require('./sqlFunctions');

var express = require('express');
var router = express.Router();

router.get('/parties', function (req, res) {
    let context = {
      title:"Parties",
      description:"Parties are the means by which characters can band together against the world's challenges. Parties can find who belongs to them by searching the character list for matching a matching partyID. This page can also use this reference to modify the partyID attribute of characters."
    };
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

router.get('/partyInsert', function (req, res) {
  let party = JSON.parse(req.get('party'));
  let members = party.members;
  delete party.members;

  sqlFunctions.insertIntoTable('Parties', party).then(function () {
    res.json(response);
  });

  sqlFunctions.getTable('Characters').then(function (characters) {
    character.forEach(character => {if (members.includes(character.characterID)) {
        character[partyID] = party.partyID;
      }
    });
  });
});

router.get('/partyModify', function (req, res) {
  let party = JSON.parse(req.get('party'));
  let members = party.members;
  delete party.members;
  console.log(party);
  sqlFunctions.updateTable('Parties', 'partyID', party.partyID, party).then(function () {
    sqlFunctions.getTable('Characters').then(function (characters) {
      character.forEach(character => {
        if(
          character.partyID &&                      //Character has a party
          character.partyID == party.partyID &&     //The party is this party
          !members.includes(character.characterID)  //The character is no longer on the member list
        ) {
          delete character.partyID;
        } else if (members.includes(character.characterID)) {
          character[partyID] = party.partyID;
        }
      });
      
      res.json(party);
    });
  });
});

  module.exports = router;