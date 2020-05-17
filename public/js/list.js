var abilityKeys = ["name", "damage_type", "range", "damage_dice"];
var biomeKeys = ["name"];
var characterKeys = ["name", "race", "class", "level", "_partyID:Parties"];
var monsterKeys = ["name", "type", "challenge", "source"];

/**
 * Load the list table sorted according to a given column
 * @param {*} table 
 * @param {*} column 
 * @param {*} button 
 */
function loadTable(table, keyList, button, orderBy = "name") {

    //Determine how the table is to be sorted
    let ascending = true;
    if(button) {
        ascending = button.hasAttribute('data-ascending');

        //Reformat headers to show correct directional arrow
        row = document.getElementById("tableHeaders");
        let headers = [...row.getElementsByTagName("th")];

        //Strip existing arrow
        headers.forEach(node => {
            node.setAttribute('data-ascending', '');
            node.classList.remove('headerSortUp');
            node.classList.remove('headerSortDown');
        });

        //Apply correct directional arrow
        if(ascending) {
            button.removeAttribute('data-ascending');
            button.classList.add('headerSortDown');
        } else {
            button.classList.add('headerSortUp')
        }
    }

    if(!ascending) {
        orderBy += " DESC";
    }
    
    listTable = document.getElementById("listTable");

    //Depopulate the existing table entries
    while (listTable.firstChild) {
        listTable.removeChild(listTable.firstChild);
    }

    //Populate table per header sort
    requestTable(table, request => {
        let elements = JSON.parse(request.responseText);
        let attributeID = 'characterID';
        elements.forEach(element => {
            addRow(listTable, element, keyList, attributeID);
        })
    }, orderBy);    
}

/**
* Submits a search query for an element of the given name and either shows an alert
* if not found or loads the element into the display table as if clicked
* @param {string} key attribute to search
* @param {HTMLElement} searchField input containing search term
* @param {string} attributeID primary key attribute name
*/
function tagSearch(key, searchField, attributeID) {
    var element = context.find(element => {return element[key] == document.getElementById(searchField).value})
    if(element) {
        console.log(element[attributeID] + ", " + attributeID);
        displayElement(element[attributeID], attributeID);
    } else {
        alert("Name not found");
    }
}

/**
* Filters list table for elements containing the matching tag
* @param {string} table name of table listing elements
* @param {string} key attribute to filter by
* @param {*} value attribute value to filter by
* @param {Array} keyList array listing attributes to be displayed
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