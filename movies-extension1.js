/* Test setting for Mozilla Firefox
about:config
privacy:file_unique_origin -> false
security.fileuri.strict_origin_policy -> false
*/

//Extension task 1 search for cast data
function search() {
    let input = getSearchCastInput();
    filterCast(input);
}

//Receiving cast from input field, checking if input is not empty and returning the input 
function getSearchCastInput() {
    let input = document.getElementById('searchCastInput').value;
    //removing whitespaces
    let clear = input.replace(/\s/g, '');
    if (clear.length > 0) {
        return input;
    } else {
        alert('No cast data for search!');
    }
}

//filter cast independently from selects, only sets to none visible, does not set rows back to visible
function filterCast(input) {
    table = document.getElementById('movieTable');
    tr = table.getElementsByTagName('tr');
    //iterate through all table rows and set the styling of cells which do not match to none (unvisible)
    for (i = 0; i < tr.length; i++) {
        tdCast = tr[i].getElementsByTagName('td')[3]; //Cast is at position 3
        if (tdCast) {
            txtCast = tdCast.innerHTML;
            txtCast = txtCast.toLowerCase();
            input = input.toLowerCase();
            if(!txtCast.match(input)){
                tr[i].style.display = 'none';
            }
        }
    }
}

//check if input field is empty
function isInputEmpty(input) {
    //deleting white spaces
    let clear = input.replace(/\s/g, '');
    if (clear.length > 0) {
        return false;
    } else {
        alert('Empty inputs or only white spaces are not allowed!');
        return true;
    }
}