window.addEventListener("DOMContentLoaded", event => {
    listElements('Monsters');
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
        /*
        if(mode == 'modify') {
            requestTable('Monster_Ability', request => {
                let abilities = JSON.parse(request.responseText);
                let abilitySelect = [...document.getElementsByClassName('monsterSelect')];
                for(i = 0; i < abilities.length; i++) {
                    let select = abilitySelect[i];
                    let options = [...select.getElementsByTagName('option')];
                    let option = options.find(option => option.getAttribute("abilityID") == abilities[i].abilityID);
                    option.setAttribute("selected", "");
                }
            }, false, 'monsterID', monsterID);
        }
        */
    });
    request.send();
}