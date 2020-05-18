window.addEventListener("DOMContentLoaded", event => {
    listCharacters();
    loadCharacter(1);
});

/**
* Loads an character into the display table
* @param {Number} characterID primary key value of character to be loaded
* @param {string} mode whether to display, modify, or add
*/
function loadCharacter(characterID, mode = 'display') {
    var request = new XMLHttpRequest();
	request.open('get', '/characterDisplay');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('characterID', characterID);
    request.setRequestHeader('mode', mode);
    request.addEventListener("load", reponse => {
        let insert = document.getElementById("display");
        insert.innerHTML = request.responseText;

        if(mode == 'modify') {
            requestTable('Characters', request => {
                let character = JSON.parse(request.responseText)[0];
                let partySelect = document.getElementById('partySelect');
                let partyOptions = [...partySelect.getElementsByTagName('option')];
                let partySelected = partyOptions.find(party => party.getAttribute('partyID') == character.partyID);
                partySelected.setAttribute('selected', '');
            }, false, 'characterID', characterID);

            requestTable('Character_Monster', request => {
                let monsters = JSON.parse(request.responseText);
                let monsterSelect = [...document.getElementsByClassName('monsterSelect')];
                for(i = 0; i < monsters.length; i++) {
                    let select = monsterSelect[i];
                    let options = [...select.getElementsByTagName('option')];
                    let option = options.find(option => option.getAttribute("monsterID") == monsters[i].monsterID);
                    option.setAttribute("selected", "");
                }
            }, false, 'characterID', characterID)
        }
    });
	request.send();
}

function listCharacters() {
    var request = new XMLHttpRequest();
	request.open('get', '/characterList');
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener("load", response => {
        let list = document.getElementById("list");
        list.innerHTML = request.responseText;
    })
    request.send();
}