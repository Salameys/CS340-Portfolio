window.addEventListener("DOMContentLoaded", event => {
    var jeff = {"characterID":1, "name":"Jeff O'Saur", "race":"Dinosaur",
    "class":"Bard", "level":3, "party":"Derpestarians",
    "strength":13, "dexterity":8, "constitution":15,
    "intelligence":11, "widsom":8, "charisma":20};

    var table = document.getElementById("characters");
    var row = document.createElement("div");
    table.appendChild(row);
    row.innerHTML="{{> characterRow jeff}}"
});

var characterList = {
    "1":{}
};

function loadCharacter(button) {
    
}