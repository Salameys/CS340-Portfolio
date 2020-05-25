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