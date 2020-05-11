window.addEventListener("DOMContentLoaded", event => {
    loadCharacter(1);
});

/**
* Loads an character into the display table
* @param {Number} characterID primary key value of character to be loaded
*/
function loadCharacter(characterID) {
    //Replace with SQL request, gets an object
    let element = context.find(element => {return element["characterID"] == characterID});
    
    Object.keys(element).forEach(key => {
        updateField(key, element[key]);
    });

    let encounters = document.getElementById("encounters");
    encounters.innerHTML = "<th colspan='6'>Monsters Encountered</th>";

    requestContent('GET', 'application/json', '/characters_monsters', request => {
        let monsters = JSON.parse(request.responseText).character_monsters;
        monsters.forEach(monster => {
            let row = addNode(encounters, "tr", "");
            let node = addNode(row, "th", "Monster");
            node.setAttribute("colspan", 2);
            node = addNode(row, "td", monster.name);
            node.setAttribute("colspan", 4);
        });
    });
}