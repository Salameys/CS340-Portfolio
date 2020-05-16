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

/**
* Updates the paired display and input fields of an attribute on the display table
* @param {string} key attribute key to be updated
* @param {*} value attribute value be updated to
*/
function updateField(key, value) {
    document.getElementById(key + "-display").innerHTML = value;
    document.getElementById(key).value = value;
}

/**
* Swaps the display table from display to edit mode
* @param {string} swapTo whether swap is to add, modify, or cancel action
*/
function swapForm(swapTo) {
    //Load nodes
    var form = document.getElementById('display-form');
    var inputs = form.querySelectorAll(".input");
    var displays = form.querySelectorAll(".display");

    //Hide display nodes and reveal blank input nodes
    if(swapTo == "add") {
        displays.forEach(node => {
            node.classList.add("hidden");
        });
        inputs.forEach(node => {
            node.classList.remove("hidden");
        });
        document.getElementById("addElement").classList.remove("hidden");
        for(i = 0; i < inputs.length - 2; i++) {
            inputs[i].firstElementChild.value = "";
        }
    }

    //Hide display nodes and reveal identically valued input nodes
    if(swapTo == "modify") {
        inputs.forEach(node => {
            node.classList.remove("hidden");
        });
        displays.forEach(node => {
            node.classList.add("hidden");
        });
        document.getElementById("modifyElement").classList.remove("hidden");
    }
    
    //Hide input nodes and reveal display nodes of object rememberd by table
    if(swapTo == "cancel") {
        inputs.forEach(node => {
            node.classList.add("hidden");
        });
        displays.forEach(node => {
            node.classList.remove("hidden");
        });
        document.getElementById("addElement").classList.add("hidden");
        document.getElementById("modifyElement").classList.add("hidden");
    }
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
 * 
 * @param {string} section name of DOM element rows will be placed in
 * @param {*} width width of table
 * @param {*} name header for relationship section
 * @param {*} table name of relationship table in database
 * @param {*} rowTitle title for each row
 */
function populateRelationshipSection(section, width, name, table, rowTitle) {
    //Clear the section of any old data and reset it
    section = document.getElementById(section);
    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }
    section.innerHTML = "<th colspan='" + width + "'>" + name + "</th>";
    
    requestTable('GET', 'application/json', '/' + table + '_table', request => {
        let entities = JSON.parse(request.responseText);
        console.log(entities);
        entities.forEach(entity => {
            addRelationshipRow(section, width, rowTitle, entity.name);
        });
    });
}

/**
 * Adds a row representing a multiple to multiple relationship to the section for that group
 * @param {HTMLElement} section DOM element row is going in
 * @param {Number} width width of whole table
 * @param {string} title type of related entity
 * @param {string} name name of related entity
 * @param {boolean} display if rendering mode is display or input
 */
function addRelationshipRow(section, width, title, name, group, options, display=true) {
    let row = addNode(section, "tr", "");
    let node = addNode(row, "th", title);
    node.setAttribute("colspan", 2);

    //Display node
    node = addNode(row, "td", name);
    node.setAttribute("colspan", width - 2);
    node.classList.add("display");
    if(!display) node.classList.add("hidden");
    
    //Edit node
    node = addNode(row, "td", "");
    node.classList.add("input");
    if(display) node.classList.add("hidden");
    let select = addNode(node, "input", "");
}