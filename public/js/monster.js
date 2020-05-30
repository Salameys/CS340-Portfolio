window.addEventListener("DOMContentLoaded", event => {
    listElements('Monsters', 'monsterList');
    loadMonster(1);
});

/**
* Loads an monster  into the display table
* @param {Number} monsterID primary key value of monster to be loaded
*/
function loadMonster(monsterID, mode = "display") {
    var request = new XMLHttpRequest();
	request.open('get', '/monsterDisplay');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('monsterID', monsterID);
    request.setRequestHeader('mode', mode);
    request.addEventListener("load", reponse => {
        let insert = document.getElementById("display");
        insert.innerHTML = request.responseText;
        
        if(mode == 'modify') {
            requestTable('Monster_Ability', request => {
                let abilities = JSON.parse(request.responseText);
                let abilitySelect = [...document.getElementsByClassName('abilitySelect')];
                for(i = 0; i < abilities.length; i++) {
                    let select = abilitySelect[i];
                    let options = [...select.getElementsByTagName('option')];
                    let option = options.find(option => option.getAttribute("abilityID") == abilities[i].abilityID);
                    option.setAttribute("selected", "");
                }
            }, false, 'monsterID', monsterID);

            requestTable('Monster_Biome', request => {
                let biomes = JSON.parse(request.responseText);
                let biomeSelect = [...document.getElementsByClassName('biomeSelect')];
                for(i = 0; i < biomes.length; i++) {
                    let select = biomeSelect[i];
                    let options = [...select.getElementsByTagName('option')];
                    let option = options.find(option => option.getAttribute("biomeID") == biomes[i].biomeID);
                    option.setAttribute("selected", "");
                }
            }, false, 'monsterID', monsterID);
        }

        if(mode != 'display') {
            addOption('abilitySelects', 'Abilities', 'abilitySelect');
            addOption('biomeSelects', 'Biomes', 'biomeSelect');
        }
    });
    request.send();
}

function buildMonster() {
    //let formElements = document.getElementById("inputForm").elements;
    let keys = [
        "name", "type", "description",
        "challenge", "armor_class", "hit_dice",
        "alignment", "speed",
        "strength", "dexterity", "constitution",
        "intelligence", "wisdom", "charisma",
        "source_book"
    ];
    
    //Build monster with mandatory keys
    let monster = {};
    let failures = [];
    keys.forEach(key => {
        console.log(key);
        monster[key] = document.getElementById(key).value;
        if(monster[key].length == 0) {
            failures.push(key);
        }
    });

    //Add nonmandatory keys as relevant
    let fly_speed = document.getElementById("fly_speed").value;
    if(fly_speed >= 0) monster["fly_speed"] = fly_speed;

    //Check if monster is valid and cancel operation if not
    if(failures.length > 0) {
        if(failures.length == 1) {
            alert ("The key " + failures[0] + " is mandatory. Monster not saved.");
        } else {
            let alertString = "The keys ";
            for(i = 0; i < failures.length - 1; i++) {
                alertString += failures[i] + ", ";
            }
            alertString += " and " + failures[failures.lastIndexOf] + " are mandatory. Monster not saved.";
            alert(alertString);
        }
        return;
    }

    monster.abilities = [];
    let abilitySelects = [...document.getElementsByClassName("abilitySelect")];
    abilitySelects.forEach(select => {
        if(select.value != "None") {
            for(i = 0; i < select.options.length; i++) {
                let option = select[i];
                if(option.selected == true) {
                    monster.abilities.push(option.getAttribute("abilityId"));
                    break;
                }
            }
        }
    });

    monster.biomes = [];
    let biomeSelects = [...document.getElementsByClassName("biomeSelect")];
    biomeSelects.forEach(select => {
        if(select.value != "None") {
            for(i = 0; i < select.options.length; i++) {
                let option = select[i];
                if(option.selected == true) {
                    monster.biomes.push(option.getAttribute("biomeId"));
                    break;
                }
            }
        }
    });
    
    return monster;
}

/**
 * Sends the monster object to the server to be added to the database
 */
function addMonster() {
    let monster = buildMonster();

    let request = new XMLHttpRequest();
	request.open('post', '/insertMonster');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('element', JSON.stringify(monster));
    request.addEventListener("load", response => {
        let monsterID = JSON.parse(request.responseText).insertId;
        loadMonster(monsterID);
    });
    request.send();

    listElements('Monsters', 'monsterList');
}

/**
 * Sends the monster object to the server to be modified in the database
 */
function confirmMonster(monsterID) {
    let monster = buildMonster();

    let request = new XMLHttpRequest();
	request.open('post', '/modifyMonster');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('element', JSON.stringify(monster));
    request.addEventListener("load", response => {
        loadMonster(monsterID);
    });
    request.send();

    listElements('Monsters', 'monsterList');
}

function deleteMonster(monsterID) {
    let request = new XMLHttpRequest();
    request.open('delete', '/table_delete');
    request.setRequestHeader('table', 'Monsters');
    request.setRequestHeader('element', 'monsterID');
    request.setRequestHeader('elementID', monsterID);
    request.addEventListener("load", response => {
        let list = document.getElementById("list");
        list.innerHTML = request.responseText;
    })
    request.send();

    listElements('Monsters', 'monsterList');
}