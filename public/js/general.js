/**
 * Requests a table and calls the provided function asynchronously
 * @param {string} table 
 * @param {function} func 
 * @param {string} orderBy 
 * @param {string} attributeKey 
 * @param {string} attributeValue 
 */
function requestTable (table, func, orderBy = false, attributeKey = false, attributeValue = null) {
	var request = new XMLHttpRequest();
	request.open('get', '/table');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('dataTable', table);
    if(attributeKey) {
        request.setRequestHeader('attributeKey', attributeKey)
        request.setRequestHeader('attributeValue', attributeValue);
    }
    if(orderBy) {
        request.setRequestHeader('orderBy', orderBy);
    }
    request.addEventListener("load", response => {func(request)});
	request.send();
}

function listElements (table, partial) {
    var request = new XMLHttpRequest();
	request.open('get', '/elementList');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('table', table);
    request.setRequestHeader('partial', partial);
    request.addEventListener("load", response => {
        let list = document.getElementById("list");
        list.innerHTML = request.responseText;
    })
    request.send();
}

function loadElement (table, partial, attributeKey, attributeValue) {
    var request = new XMLHttpRequest();
	request.open('get', '/elementDisplay');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('table', table);
    request.setRequestHeader('partial', partial);
    request.setRequestHeader('attributeKey', attributeKey);
    request.setRequestHeader('attributeValue', attributeValue);
    request.addEventListener("load", response => {
        let display = document.getElementById("display");
        display.innerHTML = request.responseText;
    });
    request.send();
}

/**
* Adds a node to the DOM as a child of an existing node
* @param {HTMLElement} parent node
* @param {string} type of node
* @param {string} content of node
*/
function addNode(parent, type, content) {
    var node = document.createElement(type);
    parent.appendChild(node);
    node.innerHTML = content;
    return node;
}

function removeOption(optionID) {
    console.log(optionID);
    let option = document.getElementById(optionID);
    console.log(option);
    option.remove();
}

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