/**
 * Handles preventing duplicate entries in related dropdowns
 * @param {string} group family of selects with same options
 * @param {string} newOption option which has been selected
 * @param {string} oldOption option which has been deselected
 */
function preventDuplicateSelection(group, newOption, oldOption) {
    group = document.getElementById(group);
    console.log(group);
    group = group.getElementsByTagName("select");
    console.log(group);
}

/**
 * Adds a row representing a multiple to multiple relationship to the section for that group
 * @param {HTMLElement} section DOM element row is going in
 * @param {Number} width width of whole table
 * @param {string} title type of related entity
 * @param {string} name name of related entity
 */
function addRelationshipRow(section, width, title, name) {
    let row = addNode(section, "tr", "");
    let node = addNode(row, "th", title);
    node.setAttribute("colspan", 2);

    node = addNode(row, "td", name);
    node.setAttribute("colspan", width - 2);
    node.classList.add("display");
    if(displayState != "display") node.classList.add("hidden");
}