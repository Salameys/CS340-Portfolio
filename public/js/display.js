
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
* @param {string} table name of table displaying element data
* @param {string} swapTo whether swap is to add, modify, or cancel action
*/
function swapForm(form, swapTo) {
    //Load nodes
    var form = document.getElementById(form);
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
        for(i = 0; i < inputs.length - 2; i++) {
            inputs[i].firstElementChild.value = "";
        }
        
        //This will be scrapped when making SQL calls, replaced by auto_increment
        var attributeID = form.children[1].id;
        form.children[0].innerHTML = Number.parseInt(context.reduce(function(max, element){
            return (element[attributeID] > max[attributeID] ? element : max);
        })[attributeID]) + 1;
    }
    //Hide display nodes and reveal identically valued input nodes
    if(swapTo == "modify") {
        inputs.forEach(node => {
            node.classList.remove("hidden");
        });
        displays.forEach(node => {
            node.classList.add("hidden");
        });
    }
    //Hide input nodes and reveal display nodes of object rememberd by table
    if(swapTo == "cancel") {
        inputs.forEach(node => {
            node.classList.add("hidden");
        });
        displays.forEach(node => {
            node.classList.remove("hidden");
        });
        displayElement(form.children[1].value, form.children[1].id);
    }
}

/**
* Inserts a new object or updates an existing one depending on sketchy logic
* @param {string} form name of form containing all relevent data
* @param {Arary} keysList array of keys for building table row
* @param {string} attributeID name of primary key attribute
*/
function confirmChange(form, keysList, attributeID) {
    form = document.getElementById(form);
    
    //Retrieve display and input id values. If same, edit. If different, new.
    var id1 = document.getElementById(attributeID + "-display").innerHTML; 
    var id2 = document.getElementById(attributeID).value;
    var same = id1 == id2;
    id = same ? id2 : id1;

    //Load object with determined id value
    var element = {};
    element[attributeID] = id;

    //Load object with key:value pairs from form
    for(var i = 1; i < form.length-5; i++) {
        var value = form.elements[i].value;
        if(Number.parseInt(value)) {
            value = Number.parseInt(value);
        }
        element[form.elements[i].id] = value;
    }
    
    //Loads the list table name, relying on naming conventions
    var table = form.id.substr(0, form.id.length-5) + "s";
    if(same) {
        //This needs to be replaced by SQL MODIFY command
        var target = context.find(element => {return element[attributeID] == id});
        Object.assign(target, element);
        //This call will stay, but modifyRow will change
        modifyRow(table, element, id, window[keysList]);
    } else {
        //This needs to be replaced by SQL INSERT command
        context.push(element);
        addRow(table, element, window[keysList], attributeID);
    }

    //Changes the form back to display mode, showing the element created or changed
    swapForm(form.id, "cancel");
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
 * Handles requesting dynamic content from the server
 * @param {string} action 
 * @param {string} type 
 * @param {string} url 
 * @param {function} func 
 * @param {string} idAttribute
 * @param {Number} idValue
 */
function requestTable (action, table, func, orderBy = false, attributeKey = false, attributeValue = null) {
	var request = new XMLHttpRequest();
	request.open(action, '/table');
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