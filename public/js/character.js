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
        if(mode != 'display') addOption('monsterSelects', 'Monsters', 'monsterSelect');;
    });
	request.send();
}

function listCharacters(attributeKey) {
    let request = new XMLHttpRequest();
	request.open('get', '/characterList');
    request.setRequestHeader('Content-Type', 'application/json');
    if (attributeKey) {
        request.setRequestHeader('attributeKey', attributeKey);
        let attributeValue = '"' + document.getElementById("search-field").value + '"';
        request.setRequestHeader('attributeValue', attributeValue);
    }
    request.addEventListener("load", response => {
        let list = document.getElementById("list");
        list.innerHTML = request.responseText;
    })
    request.send();
}

/**
 * Constructs a character object from table input data
 */
function extractCharacterData() {
    //let formElements = document.getElementById("inputForm").elements;
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

    //Checks if any data is not set
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

    //Runs through the party select
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

    //Runs through the monster selects
    character.monsters = [];
    let monsterSelects = [...document.getElementsByClassName("monsterSelect")];
    console.log(monsterSelects);
    monsterSelects.forEach(select => {
        console.log(select);
        if(select.value != "None") {
            for(i = 0; i < select.options.length; i++) {
                let option = select[i];
                console.log(option);
                if(option.selected == true) {
                    console.log(option.getAttribute("monsterID"));
                    character.monsters.push(option.getAttribute("monsterID"));
                    break;
                }
            }
        }
    });

    return character;
}

function addCharacter() {
    let character = extractCharacterData();

    let request = new XMLHttpRequest();
	request.open('post', '/characterInsert');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('table', 'Characters');
    request.setRequestHeader('character', JSON.stringify(character));
    request.addEventListener("load", response => {
        let characterID = JSON.parse(request.responseText).insertId;
        loadCharacter(characterID);
    });
    request.send();

    listCharacters();
}

function confirmCharacter(characterID) {
    let character = extractCharacterData();
    character.characterID = characterID;

    let request = new XMLHttpRequest();
	request.open('post', '/characterModify');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('table', 'Characters');
    request.setRequestHeader('character', JSON.stringify(character));
    request.addEventListener("load", response => {
        loadCharacter(characterID);
    });
    request.send();

    listCharacters();
}

/**
 * Calls the server to submit an SQL request to delete the character
 * @param {Number} characterID 
 */
function deleteCharacter(characterID) {
    let request = new XMLHttpRequest();
    request.open('delete', '/table_delete');
    request.setRequestHeader('table', 'Characters');
    request.setRequestHeader('element', 'characterID');
    request.setRequestHeader('elementID', characterID);
    request.addEventListener("load", response => {
        let list = document.getElementById("list");
        list.innerHTML = request.responseText;
    })
    request.send();

    listCharacters();
}

/*
 * Work in Progress
 */
function deleteRelationship(characterID, monsterID) {
    let request = new XMLHttpRequest();
    request.open('delete', '/delete_relationship');
    request.setRequestHeader('characterID', characterID);
    request.setRequestHeader('monsterID', monsterID);
    request.addEventListener("load", response => {
        let list = document.getElementById("list");
        list.innerHTML = request.responseText;
    })
    request.send();

   loadCharacter();
}