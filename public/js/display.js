var displayState = "display";

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
        displayState = "add";
        displays.forEach(node => {
            node.classList.add("hidden");
        });
        inputs.forEach(node => {
            node.classList.remove("hidden");
        });

        for(i = 0; i < inputs.length - 2; i++) {
            inputs[i].firstElementChild.value = "";
        }

        document.getElementById("modifyElement").classList.add("hidden");
        document.getElementById("addElement").classList.remove("hidden");
    }

    //Hide display nodes and reveal identically valued input nodes
    if(swapTo == "modify") {
        displayState = "modify";
        inputs.forEach(node => {
            node.classList.remove("hidden");
        });
        displays.forEach(node => {
            node.classList.add("hidden");
        });
        
        document.getElementById("addElement").classList.add("hidden");
        document.getElementById("modifyElement").classList.remove("hidden");
    }
    
    //Hide input nodes and reveal display nodes of object rememberd by table
    if(swapTo == "cancel") {
        displayState = "display";
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
function populateRelationshipSection(section, width, table, rowTitle, filterAttribute, filterValue) {
    //Clear the section of any old data and reset it
    section = document.getElementById(section);
    let header = section.firstElementChild;
    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }
    section.appendChild(header);
    
    requestTable(table, subset => {
        requestTable(table.substring(table.search("_") + 1), names => {
            subset = JSON.parse(subset.responseText);
            names = JSON.parse(names.responseText);
            compareAttribute = Object.keys(names[0])[0];

            for(i = 0; i < subset.length; i++)
            {
                let element = names.find(element => element[compareAttribute] == subset[i][compareAttribute]);
                addRelationshipRow(section, width, rowTitle, element.name);
            }
        });
    }, false, filterAttribute, filterValue);
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