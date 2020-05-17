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

