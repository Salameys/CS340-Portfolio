window.addEventListener("DOMContentLoaded", event => {
    listParties('parties');
    loadParty(1);
});

/**
 * Loads party data utilizing the characters table
 * @param {number} partyID
 * @param {string} mode
 */

function loadParty(partyID, mode = "display") {
    var request = new XMLHttpRequest();
	request.open('get', '/partyDisplay');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('partyID', partyID);
    request.setRequestHeader('mode', mode);
    request.addEventListener("load", reponse => {
        let display = document.getElementById("display");
        display.innerHTML = request.responseText;

        if(mode == 'modify') {
            requestTable('Characters', request => {
                let characters = JSON.parse(request.responseText);
                console.log(characters);
                let memberSelects = [...document.getElementsByClassName('characterSelect')];
                console.log(memberSelects);
                for(i = 0; i < characters.length; i++) {
                    let memberSelect = memberSelects[i];
                    let options = [...memberSelect.getElementsByTagName('option')];
                    let option = options.find(option => option.getAttribute("characterID") == characters[i].characterID);
                    option.setAttribute("selected", "");
                }
            }, false, 'partyID', partyID);
        }
        if (mode != 'display') addOption('characterSelects', 'Characters');;
    });
    request.send();
}

/**
 * Lists all parties
 */

function listParties() {
    let request = new XMLHttpRequest();
    request.open('get', '/partyList');
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener("load", response => {
        let list = document.getElementById("list");
        list.innerHTML = request.responseText;
    })
    request.send();
}

/**
 * Creates a party object and returns that party
 */

function extractPartyData() {
    let party = { name: document.getElementById("name").value };
    if (party.name.length == 0) {
        alert("A party must have a name. Party not saved.");
        return;
    }

    //Runs through the member selects
    party.members = [];
    let memberSelects = [...document.getElementsByClassName("characterSelect")];
    console.log(memberSelects);
    memberSelects.forEach(select => {
        if(select.value != "None") {
            for(i = 0; i < select.options.length; i++) {
                let option = select[i];
                if(option.selected == true) {
                    party.members.push(option.getAttribute("characterID"));
                    break;
                }
            }
        }
    });

    return party;
}

/**
 * Sends party object to the server to be added to the database
 */

function addParty() {
    let party = extractPartyData();
    if(!party) return; 

    let request = new XMLHttpRequest();
    request.open('post', '/partyInsert');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('party', JSON.stringify(party));
    request.addEventListener("load", response => {
        let partyID = JSON.parse(request.responseText).insertId;
        loadParty(partyID);
    });
    request.send();


    listParties();
} 

/**
 * Sends the party object to be modified in the database
 * @param {number} partyID
 */

function confirmParty(partyID) {
    let party = extractPartyData();
    if(!party) return;
    console.log(party);

    let request = new XMLHttpRequest();
    request.open('post', '/partyModify');
    request.setRequestHeader('partyID', partyID);
    request.setRequestHeader('party', JSON.stringify(party));
    request.addEventListener("load", response => {
        loadParty(partyID);
        listParties();
    })
    request.send();
}

/**
 * Deletes a party object from the table
 * @param {any} partyID
 */

function deleteParty(partyID) {
    let request = new XMLHttpRequest();
    request.open('delete', '/delete_party');
    request.setRequestHeader('partyID', partyID);
    request.addEventListener("load", response => {
        let list = document.getElementById("list");
        list.innerHTML = request.responseText;
    })
    request.send();

    listParties();
}
