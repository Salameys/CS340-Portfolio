window.addEventListener("DOMContentLoaded", event => {
    var table = document.getElementById("characters");
});

function loadCharacter(button) {
    var id = button.getAttribute("id");
    var character = context.find(element => {return element.characterID == id});
    var display = document.getElementById("display");
    Object.keys(character).forEach(key => {
        updateField(key, character[key]);
    });
}

function updateField(name, value) {
    console.log(name, ":", value)
    document.getElementById(name + "-display").innerHTML = value;
    document.getElementById(name).value = value;
}