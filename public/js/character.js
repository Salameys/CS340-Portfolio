window.addEventListener("DOMContentLoaded", event => {
    loadTable('Characters', characterKeys)
    loadCharacter(1);
});

/**
* Loads an character into the display table
* @param {Number} characterID primary key value of character to be loaded
*/
function loadCharacter(characterID) {
    var request = new XMLHttpRequest();
	request.open('get', '/characterDisplay');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('characterID', 1);
    request.setRequestHeader('modify', 'display');
    
    request.addEventListener("load", reponse => {
        console.log(request.responseText);
        let insert = document.getElementById("insert");
        insert.innerHTML = request.responseText;
    });
	request.send();
}

function swapFormCharacter(swapTo) {
    //Set default party to none when making a new character
    if(swapTo == "add") {
        let select = document.getElementById("partyID");
        let options = [...select.getElementsByTagName("option")];
        options.forEach(option => option.removeAttribute('selected'));
        options[0].setAttribute('selected', '');
    }

    requestTable('Monsters', request => {
        let section = document.getElementById("encounters");
        let monsters = JSON.parse(request.responseText);

        //Create the dropdown template
        let row = document.createElement("tr");
        let node = addNode(row, "th", "Monster");
        node.setAttribute("colspan", 2);
        node = addNode(row, "td", "");
        node.setAttribute("colspan", 3)
        let select = addNode(node, "select");
        for(i = 0; i < monsters.length; i++) {
            let option = addNode(select, "option", monsters[i]["name"]);
        }

        if(swapTo == "modify") {
            addMonsterDropdown(section, row);
        }
    
        if(swapTo = "cancel") {
        }
    });
    
    swapForm(swapTo)
}

function addMonsterDropdown(section, select) {
    section.appendChild(select.cloneNode(true));
}