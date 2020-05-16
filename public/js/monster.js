window.addEventListener("DOMContentLoaded", event => {
    loadMonster(1);
});

/**
* Loads an monster  into the display table
* @param {Number} monsterID primary key value of monster to be loaded
*/
function loadMonster(monsterID) {
    requestTable('application/json', 'Monsters', monsterRequest => {
        let monster = JSON.parse(monsterRequest.responseText)[0];
    
        Object.keys(monster).forEach(key => {
            updateField(key, monster[key]);
        });

    /*
    let foundIn = document.getmonstersById("foundIn");
    foundIn.innerHTML = "<th colspan='6'>Found In</th>";

    requestContent('application/json', '/monster_biomes', request => {
        let biomes = JSON.parse(request.responseText).monster_biomes;
        biomes.forEach(biome => {
            let row = addNode(foundIn, "tr", "");
            let node = addNode(row, "th", "Biome");
            node.setAttribute("colspan", 2);
            node = addNode(row, "td", biome.name);
            node.setAttribute("colspan", 4);
        });
    });

    let abilityList = document.getmonstersById("abilityList");
    abilityList.innerHTML = "<th colspan='6'>Abiliites</th>";
    
    requestContent('application/json', '/monster_abilities', request => {
        let abilities = JSON.parse(request.responseText).monster_abilities;
        abilities.forEach(ability => {
            let row = addNode(abilityList, "tr", "");
            let node = addNode(row, "th", "Ability");
            node.setAttribute("colspan", 2);
            node = addNode(row, "td", ability.name);
            node.setAttribute("colspan", 4);
        });
        */
    }, 'monsterID', monsterID);
}