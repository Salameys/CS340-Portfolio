var abilityKeys = ["name", "damage_type", "range", "damage_dice"];
var biomeKeys = ["name"];
var characterKeys = ["name", "race", "class", "level", "party"];
var monsterKeys = ["name", "type", "challenge", "source"];

function loadElement(elementID, attributeID) {
    //Replace with SQL request
    var element = context.find(element => {return element[attributeID] == elementID});
    Object.keys(element).forEach(key => {
        updateField(key, element[key]);
    });
}

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
        //This will be scrapped when making SQL calls
        var attributeID = form.children[1].id;
        form.children[0].innerHTML = Number.parseInt(context.reduce(function(max, element){
            return (element[attributeID] > max[attributeID] ? element : max);
        })[attributeID]) + 1;
    }
    if(swapTo == "modify") {
        inputs.forEach(node => {
            node.classList.remove("hidden");
        });
        displays.forEach(node => {
            node.classList.add("hidden");
        });
    }
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

function confirmChange(form, keysList, attributeID) {
    form = document.getElementById(form);
    
    var id1 = document.getElementById(attributeID + "-display").innerHTML; 
    var id2 = document.getElementById(attributeID).value;
    var same = id1 == id2;
    id = same ? id2 : id1;

    var element = {};
    element[attributeID] = id;

    for(var i = 1; i < form.length-5; i++) {
        var value = form.elements[i].value;
        if(Number.parseInt(value)) {
            value = Number.parseInt(value);
        }
        element[form.elements[i].id] = value;
    }
    
    var table = form.id.substr(0, form.id.length-5) + "s";
    if(same) {
        var target = context.find(element => {return element[attributeID] == id});
        Object.assign(target, element);
        modifyRow(table, element, id, window[keysList]);
    } else {
        context.push(element);
        addRow(table, element, window[keysList], attributeID);
    }
    swapForm(form.id, "cancel");
}

function deleteElement(table, attributeID) {
    var table = document.getElementById(table);
    var elementID = document.getElementById(attributeID).value;
    var row;
    for(var node of table.firstElementChild.childNodes) {
        if(node.id == elementID) {
            row = node;
            break;
        }
    }
    row.remove();
    context = context.filter(element => {
        return element[attributeID] !== elementID;
    });
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
    for(var node of table.firstElementChild.childNodes) {
        console.log(node);
        if(node.id == elementID) {
            row = node;
            break;
        }
    }
    
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
    var row = addNode(table.firstElementChild, "tr", "")
    row.setAttribute("class", "clickable-row");
    row.setAttribute("id", element[attributeID]);
    row.setAttribute("onclick", "loadElement(" + element[attributeID] + ", '" + attributeID + "')");

    keyList.forEach(key => {
        addNode(row, "td", element[key]);
    });
}

function addNode(parent, type, content) {
    var node = document.createElement(type);
    parent.appendChild(node);
    node.innerHTML = content;
    return node;
}