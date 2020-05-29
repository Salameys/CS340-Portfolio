window.addEventListener("DOMContentLoaded", event => {
    listParties('parties');
    loadParty(1);
});

function loadParty(partyID, mode = "display") {
    var request = new XMLHttpRequest();
	request.open('get', '/partyDisplay');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('partyID', partyID);
    request.setRequestHeader('mode', mode);
    console.log(mode);
    request.addEventListener("load", reponse => {
        let display = document.getElementById("display");
        display.innerHTML = request.responseText;

        if(mode == 'modify') {
            requestTable('Characters', request => {
                let characters = JSON.parse(request.responseText);
                let memberSelects = [...document.getElementsByClassName('member')];
                for(i = 0; i < memberSelects.length; i++) {
                    let memberSelect = memberSelects[i];
                    let options = [...memberSelect.getElementsByTagName('option')];
                    let option = options.find(option => option.getAttribute("characterID") == characters[i].characterID);
                    option.setAttribute("selected", "");
                }
            }, false, 'partyID', partyID);
        }
        if (mode != 'display') addOption('memberSelects', 'Characters');;
    });
    request.send();
}

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

function addParty() {
    let party = { name: document.getElementById("name").value };
    if (party.name.length == 0) {
        alert("A party must have a name. Party not saved.");
        return;
    }


    let request = new XMLHttpRequest();
    request.open('post', '/table_insert');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('table', 'Parties');
    request.setRequestHeader('element', JSON.stringify(party));
    request.addEventListener("load", response => {
        let partyID = JSON.parse(request.responseText).insertId;
        loadParty(partyID);
    });
    request.send();


    listParties();
} 

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
