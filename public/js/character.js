window.addEventListener("DOMContentLoaded", event => {
    var table = document.getElementById("characters");
});

function loadCharacter(button) {
    var id = button.getAttribute("id");
    var character = context.find(element => element.characterID = id);
    console.log(character);
}