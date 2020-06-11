window.addEventListener("DOMContentLoaded", event => {
    loadElement('Abilities', 'abilityDisplay', 'abilityId', 1);
    listElements('Abilities', 'abilityList');
});

/**
 * Function deletes a specific ability based
 * on the selected abilityID
 * @param {any} abilityID
 */

function deleteAbility(abilityID) {
    let request = new XMLHttpRequest();
    request.open('delete', '/table_delete');
    request.setRequestHeader('table', 'Abilities');
    request.setRequestHeader('element', 'abilityID');
    request.setRequestHeader('elementID', abilityID);
    request.addEventListener("load", response => {
        let list = document.getElementById("list");
        list.innerHTML = request.responseText;
    })
    request.send();
    listElements('Abilities', 'abilityList');
}