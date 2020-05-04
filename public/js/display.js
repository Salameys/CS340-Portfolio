function loadElement(button, elementID) {
    var id = button.getAttribute("id");
    //Replace with SQL request
    var element = context.find(element => {return element[elementID] == id});
    Object.keys(element).forEach(key => {
        updateField(key, element[key]);
    });
}

function updateField(name, value) {
    document.getElementById(name + "-display").innerHTML = value;
    document.getElementById(name).value = value;
}

function addElement(form, elementID) {
    form = document.getElementById(form);
    
    var id = Number.parseInt(context.reduce(function(prev, next){
        return (prev[elementID] > next[elementID] ? prev[elementID] : next[elementID]);
    }));
    id += 1;

    var element = {};
    element[elementID] = id;

    for(var i = 1; i < form.length-3; i++) {
        var value = form.elements[i].value;
        if(Number.parseInt(value)) {
            value = Number.parseInt(value);
        }
        element[form.elements[i].id] = value;
    }
    
    context.push(element);
    addCharacterRow(element);
}

function modifyElement(elementID) {

}

function deleteElement(elementID) {

}

function addCharacterRow(element) {
    var table = document.getElementById('characters');
    var row = addNode(table, "tr", "")
    row.setAttribute("class", "clickable-row");
    row.setAttribute("id", element["characterID"]);
    row.setAttribute("onclick", "loadElement(this, 'characterID')");

    addNode(row, "td", element["name"]);
    addNode(row, "td", element["race"]);
    addNode(row, "td", element["class"]);
    addNode(row, "td", element["level"]);
    addNode(row, "td", element["party"]);
}

function addNode(parent, type, content) {
    var node = document.createElement(type);
    parent.appendChild(node);
    node.innerHTML = content;
    return node;
}