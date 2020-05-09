var abilityKeys = ["name", "damage_type", "range", "damage_dice"];
var biomeKeys = ["name"];
var characterKeys = ["name", "race", "class", "level", "party"];
var monsterKeys = ["name", "type", "challenge", "source"];

/*
* Loads an element into the display table
* @param elementID id number of element
* @param attributeID name of id attribute
*/
function loadElement(elementID, attributeID) {
    //Replace with SQL request, gets an object
    var element = context.find(element => {return element[attributeID] == elementID});
    Object.keys(element).forEach(key => {
        updateField(key, element[key]);
    });
}

/*
* Submits a search query for an element of the given name and either shows an alert
* if not found or loads the element into the display table as if clicked
* @param key attribute to search
* @param searchField input containing search term
* @param attributeID name of ID attribute for the element
*/
function tagSearch(key, searchField, attributeID) {
    var element = context.find(element => {return element[key] == document.getElementById(searchField).value})
    if(element) {
        console.log(element[attributeID] + ", " + attributeID);
        loadElement(element[attributeID], attributeID);
    } else {
        alert("Name not found");
    }
}

/*
* Filters list table for elements containing the matching tag
* @param table list table DOM element
* @param key to filter by
* @param value to filter by within key
* @param keyList list of keys to rebuild table with
*/
function filterList(table, key, value, keyList) {
    Array.from(document.getElementById(table)
    .getElementsByTagName("tr"))
    .forEach(row => {
        if(row.classList.contains("clickable-row")) {
            row.remove();
        }
    });
    context.forEach(element => {
        if(element[key] == value) {
            addRow(table, element, keyList);
        }
    })
}

/*
* Updates teh paired display and input fields of an attribute on the display table
* @param key of attribute to be updated
* @param value to be updated to
*/
function updateField(key, value) {
    document.getElementById(key + "-display").innerHTML = value;
    document.getElementById(key).value = value;
}

/*
* Swaps the display table from display to edit mode
* @param table id of table
* @param toInput whether to swap to or from input
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
        loadElement(form.children[1].value, form.children[1].id);
    }
}

/*
* Inserts a new object or updates an existing one depending on sketchy logic
* @param form containing all relevent data
* @param keysList array of keys for building table row
* @param attributeID key name for id attribute
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

/*
* Deletes an element from the database and from the display table
* @param table name of list table
* @attributeID 
*/
function deleteElement(table, attributeID) {
    var table = document.getElementById(table);
    //The display table has a hidden input with the attributeID as its ID attribute
    var elementID = document.getElementById(attributeID).value;
    var row;
    //Run through the rows of the list table looking for the one matching the elementID
    for(var node of table.firstElementChild.childNodes) {
        if(node.id == elementID) {
            row = node;
            break;
        }
    }
    row.remove();

    //This will be outmoded by SQL, replaced by REMOVE
    context = context.filter(element => {
        return element[attributeID] !== elementID;
    });

    //Reloads the display table with the first table element
    loadElement(context[0][attributeID], attributeID);
}

/*
* Modifies a row of the table
* @param table to be modified
* @param element to be modified
* @param keyList list of keys from element in row
*/
function modifyRow(table, element, elementID, keyList) {
    var table = document.getElementById(table);
    var row;
    //Run through the rows of the list table looking for the one matching the elementID
    for(var node of table.firstElementChild.childNodes) {
        console.log(node);
        if(node.id == elementID) {
            row = node;
            break;
        }
    }
    
    //Runs through each column in the row and updates its value
    row = Array.from(row.getElementsByTagName("td"));
    for(i = 0; i < keyList.length; i++) {
        row[i].innerHTML = element[keyList[i]];
    }
}

/*
* Adds a row to the table
* @param table to be added to
* @param element to be added
* @param keyList list of keys from element in row
*/
function addRow(table, element, keyList, attributeID) {
    var table = document.getElementById(table);

    //Build the empty row
    var row = addNode(table.firstElementChild, "tr", "")
    row.setAttribute("class", "clickable-row");
    row.setAttribute("id", element[attributeID]);
    row.setAttribute("onclick", "loadElement(" + element[attributeID] + ", '" + attributeID + "')");

    //Populate the row with each column
    keyList.forEach(key => {
        addNode(row, "td", element[key]);
    });
}

/*
* Adds a node to the DOM as a child of an existing node
* @param parent node
* @param type of node
* @param content of node
*/
function addNode(parent, type, content) {
    var node = document.createElement(type);
    parent.appendChild(node);
    node.innerHTML = content;
    return node;
}