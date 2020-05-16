window.addEventListener("DOMContentLoaded", event => {
    loadTable('Characters', characterKeys)
    loadCharacter(1);
});

/**
* Loads an character into the display table
* @param {Number} characterID primary key value of character to be loaded
*/
function loadCharacter(characterID) {
    requestTable('GET', 'Characters', characterRequest => {
        let character = JSON.parse(characterRequest.responseText)[0];
    
        Object.keys(character).forEach(key => {
            if(key != 'partyID') {
                updateField(key, character[key]);
            }
        });

        requestTable('GET', 'Parties', partyRequest => {
            updateField('partyID', JSON.parse(partyRequest.responseText)[0].name);
        }, false, 'partyID', character.partyID);

        //populateRelationshipSection("encounters", 6, "Monsters Encountered", "characters_monsters", "Monster");
    }, false, 'characterID', characterID);
}