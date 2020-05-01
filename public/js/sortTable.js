/*
* Sorts a table by a given column's values.
* @param table - id in DOM of table to be sorted
* @param column - column containing data to be compared
* @param button - DOM node for column header being used and modified
*/
function sortTable(table, column, button) {
    //Retrieve the table data
    table = document.getElementById(table);
    var rows = table.rows;

    //Determine how the table is to be sorted
    var ascending = button.hasAttribute('data-ascending');
    var isInt = button.hasAttribute('data-int');

    //Simple bubble sort
    var switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            //Call on compare function and remember or set need for another loop as appropriate
            switching = switching || compareAndSwap(rows, i, column, isInt, ascending);
        }
    }

    //Reformat headers to show correct directional arrow
    var row = rows[0];
    let headers = [...row.getElementsByTagName("th")];

    //Strip existing arrow
    headers.forEach(node => {
        node.setAttribute('data-ascending', '');
        node.classList.remove('headerSortUp');
        node.classList.remove('headerSortDown');
    });

    //Apply correction directional arrow
    if(ascending) {
        button.removeAttribute('data-ascending');
        button.classList.add('headerSortDown');
    } else {
        button.classList.add('headerSortUp')
    }
}

/*
* Compares and swaps two rows of a table based on input parameters
* @param rows - The rows of the table to be sorted
* @param i - index of first row to be compared
* @param column - column containing data to be compared
* @param isInt - whether data should be parsed as int or string
* @param ascending - wheter rows should be sorted ascending or decending
* @return whether a swtich was made
*/
function compareAndSwap(rows, i, column, isInt, ascending) {
    //Retrieve data to be compared
    var x = rows[i].getElementsByTagName("td")[column].innerHTML;
    var y = rows[i+1].getElementsByTagName("td")[column].innerHTML;
    
    //Parse for comparison
    if(isInt) {
        x = parseInt(x);
        y = parseInt(y);
    } else {
        x = x.toLowerCase();
        y = y.toLowerCase();
    }
    
    //Compare and swap
    if ((x > y) == ascending) {
        if (x == y) {
            if(column == 0) return false;
            return compareAndSwap(rows, i, 0, false, ascending);
        }
        rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
        return true;
    }
}