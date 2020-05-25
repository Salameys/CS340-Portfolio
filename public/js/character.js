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
    let request = new XMLHttpRequest();
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
        if(mode != 'display') addOption('monsterSelects', 'Monsters');;
    });
	request.send();
}

function listCharacters() {
    let request = new XMLHttpRequest();
	request.open('get', '/characterList');
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener("load", response => {
        let list = document.getElementById("list");
        list.innerHTML = request.responseText;
    })
    request.send();
}

function addCharacter() {
    let keys = [
        "name", "race", "class", "level",
        "strength", "dexterity", "constitution",
        "intelligence", "wisdom", "charisma"
    ];
    
    let character = {};
    let failures = [];
    keys.forEach(key => {
        character[key] = document.getElementById(key).value;
        if(character[key].length == 0) {
            failures.push(key);
        }
    });

    if(failures.length > 0) {
        if(failures.length == 1) {
            alert ("The key " + failures[0] + " is mandatory. Character not saved.");
        } else {
            let alertString = "The keys ";
            for(i = 0; i < failures.length - 1; i++) {
                alertString += failures[i] + ", ";
            }
            alertString += " and " + failures[failures.lastIndexOf] + " are mandatory. Character not saved.";
            alert(alertString);
        }
        return;
    }

    let partySelect = document.getElementById("partySelect");
    if(partySelect.value != "None") {
        for(i = 0; i < partySelect.options.length; i++) {
            let option = partySelect[i];
            if(option.selected == true) {
                character.partyID = option.getAttribute("partyID");
                break;
            }
        }
    }
    
    let request = new XMLHttpRequest();
	request.open('post', '/table_insert');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('table', 'Characters');
    request.setRequestHeader('element', JSON.stringify(character));
    request.addEventListener("load", response => {
        let characterID = JSON.parse(request.responseText).insertId;
        loadCharacter(characterID);

        let monsterSelects = [...document.getElementsByClassName("monsterSelect")];
        monsterSelects.forEach(select => {
            if(select.value != "None") {
                let monsterID;
                for(i = 0; i < select.options.length; i++) {
                    let option = select[i];
                    if(option.selected == true) {
                        monsterID = option.getAttribute("monsterID");
                        break;
                    }
                }
                
                let selectRequest = new XMLHttpRequest();
                selectRequest.open('post', '/table_insert');
                selectRequest.setRequestHeader('Content-Type', 'application/json');
                selectRequest.setRequestHeader('table', 'Character_Monster');
                selectRequest.setRequestHeader('element', JSON.stringify({characterID:characterID, monsterID:monsterID}));
                selectRequest.send();
            }
        });
    });
    request.send();

    listCharacters();
}