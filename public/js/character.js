window.addEventListener("DOMContentLoaded", event => {
    loadTable('Characters', characterKeys)
    loadCharacter(1);
});

/**
* Loads an character into the display table
* @param {Number} characterID primary key value of character to be loaded
*/
function loadCharacter(characterID) {
    requestTable('Characters', characterRequest => {
        let character = JSON.parse(characterRequest.responseText)[0];
    
        Object.keys(character).forEach(key => {
            if(key != 'partyID') {
                updateField(key, character[key]);
            }
        });

        requestTable('Parties', partyRequest => {
            let parties = JSON.parse(partyRequest.responseText);
            updateField('partyID', parties.find(party => party.partyID == character.partyID).name);

            let select = document.getElementById("partyID");
            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }
            
            let option = addNode(select, "option", "None");
            parties.forEach(party => {
                option = addNode(select, "option", party.name)
                if(party.partyID == character.partyID) {
                    option.setAttribute('selected', '');
                }
            });
        });

        //populateRelationshipSection("encounters", 6, "Monsters Encountered", "characters_monsters", "Monster");
    }, false, 'characterID', characterID);
}

function addCharacter() {

}