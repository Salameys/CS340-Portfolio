window.addEventListener("DOMContentLoaded", event => {
    var request = new XMLHttpRequest();
	request.open('get', '/characterDisplay');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('characterID', 1);
    
    request.addEventListener("load", reponse => {
        console.log(request.responseText);
        let insert = document.getElementById("insert");
        insert.innerHTML = request.responseText;
    });
	request.send();
});