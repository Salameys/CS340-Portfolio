
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

function listElements (table, partial, attributeKey) {
    var request = new XMLHttpRequest();
	request.open('get', '/elementList');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('table', table);
    request.setRequestHeader('partial', partial);
    if (attributeKey) {
        request.setRequestHeader('attributeKey', attributeKey);
        let attributeValue = '"' + document.getElementById("search-field").value + '"';
        request.setRequestHeader('attributeValue', attributeValue);
    }

    request.addEventListener("load", response => {
        let list = document.getElementById("list");
        list.innerHTML = request.responseText;
    })
    request.send();
}

/**
* Loads an element into the display table
* @param { string } table database table to request
* @param { string } partial handlebars partial name to load
* @param { string } attributeKey id attribute name
* @param { string } attributeValue id attribute value
*/
function loadElement (table, partial, attributeKey, attributeValue, mode = 'display') {
    var request = new XMLHttpRequest();
	request.open('get', '/elementDisplay');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('table', table);
    request.setRequestHeader('partial', partial);
    request.setRequestHeader('attributeKey', attributeKey);
    request.setRequestHeader('attributeValue', attributeValue);
    request.setRequestHeader('mode', mode);
    request.addEventListener("load", response => {
        let display = document.getElementById("display");
        display.innerHTML = request.responseText;
    });
    request.send();
}

/**
 * Assembles an element object from page data
* @param {string[]} mandatoryKeys element keys which are required
* @param {string[]} optionalKeys element keys which can be ignored
 */
function buildElement(mandatoryKeys, optionalKeys = []) {
    let element = {};
    let failures = [];
    mandatoryKeys.forEach(key => {
        console.log(key);
        element[key] = document.getElementById(key).value;
        if (element[key].length == 0) {
            failures.push(key);
        }
    });
    optionalKeys.forEach(key => {
        console.log(key);
        element[key] = document.getElementById(key).value;
    });


    if (failures.length > 0) {
        if (failures.length == 1) {
            alert(table + " must have a " + failures[0] + ". Element not saved.");
        } else {
            let alertString = table + " must have ";
            for (i = 0; i < failures.length - 1; i++) {
                alertString += failures[i] + ", ";
            }
            alertString += " and " + failures[failures.length - 1] + ". Element not saved.";
            alert(alertString);
        }
        return;
    }

    return element;
}

/**	
* Adds an element to the database
* @param {string} table database table to request
* @param {string} partial handlebars partial name of element list
* @param {string} attributeKey id attribute name
* @param {string[]} mandatoryKeys element keys which are required
* @param {string[]} optionalKeys element keys which can be ignored
*/
function addElement(table, partial, attributeKey, mandatoryKeys, optionalKeys = []) {
    let element = buildElement(mandatoryKeys, optionalKeys);

    let request = new XMLHttpRequest();
    request.open('post', '/table_insert');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('table', table);
    request.setRequestHeader('element', JSON.stringify(element));
    request.addEventListener("load", response => {
        let attributeValue = JSON.parse(request.responseText).insertId;
        loadElement(table, partial.substring(0, partial.length - 4) + "Display", attributeKey, attributeValue);
    });
    request.send();

    listElements(table, partial);
}

/**	
* Adds an element to the database
* @param {string} table database table to request
* @param {string} partial handlebars partial name of element list
* @param {string} attributeKey id attribute name
* @param {Number} attributeValue id attribute value
* @param {string[]} mandatoryKeys element keys which are required
* @param {string[]} optionalKeys element keys which can be ignored
*/
function modifyElement(table, partial, attributeKey, attributeValue, mandatoryKeys, optionalKeys = []) {
    let element = buildElement(mandatoryKeys, optionalKeys);
    element[attributeKey] = attributeValue;

    let request = new XMLHttpRequest();
    request.open('post', '/table_modify');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('table', table);
    request.setRequestHeader('element', JSON.stringify(element));
    request.setRequestHeader('attributeKey', attributeKey)
    request.addEventListener("load", response => {
        let attributeValue = JSON.parse(request.responseText).insertId;
        loadElement(table, partial.substring(0, partial.length - 4) + "Display", attributeKey, attributeValue);
    });
    request.send();

    listElements(table, partial);
}


/**
* Adds a node to the DOM as a child of an existing node
* @param {HTMLElement} parent node
* @param {string} type of node
* @param {string} content of node
*/
function addNode(parent, type, content = '') {
    var node = document.createElement(type);
    parent.appendChild(node);
    if(content) node.innerHTML = content;
    return node;
}

/**
 * Adds a select row populated with all available options
 * @param {string} selects name of tbody element select row will be child to
 * @param {string} table name of table in database
 * @param {string} className class used to select option
 */
function addOption(selects, table, className) {
    let tbody = document.getElementById(selects);
    selects = [...tbody.getElementsByTagName("tr")];

    let index = 0;
    for(i = 0; i < selects.length; i++)  {
        let derp = Number.parseInt(selects[i].id.substring(1));
        if(!isNaN(derp) && derp > index) index = derp;
    }
    index += 1;
    
    let rowID = table.substring(0, 1) + index;  //Would cause a collision if two tables related to entity had the same first letter
    let row = addNode(tbody, "tr");
    row.setAttribute("id", rowID);
    addNode(row, "th", table.substring(0, table.length - 1));

    let select = addNode(row, "td");
    select.setAttribute("colspan", 4); //May need to be changed if something without stats has a relationship box
    select = addNode(select, "select");
    select.classList.add(className);
    addNode(select, "option", "None");

    requestTable(table, request => {
        let options = JSON.parse(request.responseText);
        options.forEach(option => {
            let node = addNode(select, "option", option["name"]);
            let id = className.substring(0, className.length - 6) + "ID";
            console.log(id);
            node.setAttribute(id, option[id]);
        });
    });

    let button = addNode(row, "td");
    button.classList.add("center");
    button = addNode(button, "button", "-");
    button.setAttribute("onClick", "removeOption('" + rowID + "')");
    console.log(button.getAttribute("onClick"));
}

/**
* Removes an option of the given ID from the DOM
* @param {string} optionID id string of element
*/
function removeOption(optionID) {
    let option = document.getElementById(optionID);
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
 * Sets a lower bound for a  given input, recommended to call with onchange
 * @param {HTMLElment} input Input element to be clamped
 * @param {Number} min Minimum value to clamp to
 * @param {Boolean} round Whether to round as well
 */
function minimum(input, min, round=true) {
    if(round) input.value = Math.round(input.value);
    if(input.value < min) input.value = min;
}