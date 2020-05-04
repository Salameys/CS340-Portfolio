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