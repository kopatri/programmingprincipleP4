/* Test setting for Mozilla Firefox
about:config
privacy:file_unique_origin -> false
security.fileuri.strict_origin_policy -> false
*/

//constant to handle empty cells, will be assigned if a cell is empty
const emptyCell = 'Not classified';

//fetch the movies data
fetch('movies-small.json')
    .then(response => response.json())
    .then(data => {
        populateTableWith(data, 'movieTable', 'tbody');
        populateYearSelect(data);
        populateGenresSelect(data);
    })
    .catch(error => console.log(error));

//populating the table with the fetched movie data
function populateTableWith(data, tableID, tableBodyTag) {
    let tableBody = document.getElementById(tableID).getElementsByTagName(tableBodyTag)[0];
    for (i = 0; i < data.length; i++) {
        //Inserting row
        let newRow = tableBody.insertRow();
        //Inserting cells to row
        let year = newRow.insertCell();
        let title = newRow.insertCell();
        let genres = newRow.insertCell();
        let cast = newRow.insertCell();
        //Appending text to corresponding cell
        year.appendChild(document.createTextNode(data[i].year));
        title.appendChild(document.createTextNode(data[i].title));
        //Handling empty cell for genres and cast
        checkContentAndAppend(data[i].genres, genres);
        checkContentAndAppend(data[i].cast, cast);
    }
}

//Check if a table cell would be empty, if the cell is empty the constant for empty cells will be assigned 
function checkContentAndAppend(textValue, cell) {
    if (textValue.length == 0) {
        cell.appendChild(document.createTextNode(emptyCell));
    } else {
        cell.appendChild(document.createTextNode(textValue));
    }
}


//Populating the select 'selectYear' dynamically
//The valuesYear-Array will receive each year only once
function populateYearSelect(data) {
    let valuesYear = [];
    valuesYear.push('All');
    for (i = 0; i < data.length; i++) {
        //Checking if value is not already in the array
        if (valuesYear.indexOf(data[i].year) === -1) {
            valuesYear.push(data[i].year);
        }
    }
    //invoking method which fills the corresponding select with values
    populateSelect(valuesYear, 'selectYear');
}

//Populating the select 'genreYear' dynamically
//The valuesGenres-Array will receive each genre only once
function populateGenresSelect(data) {
    let valuesGenres = [];
    valuesGenres.push('All');
    for (i = 0; i < data.length; i++) {
        //Check if movies do not have a genre classification, if not then the empty cell value will be pushed only once to genre array
        if (data[i].genres.length === 0 && valuesGenres.indexOf(emptyCell) === -1) {
            valuesGenres.push(emptyCell);
        }
        for (k = 0; k < data[i].genres.length; k++) {
            //Checking if value is not already in the array
            if (valuesGenres.indexOf(data[i].genres[k]) === -1) {
                valuesGenres.push(data[i].genres[k]);
            }
        }
    }
    //invoking method which fills the corresponding select with values
    populateSelect(valuesGenres, 'selectGenre');
}

//Filling the select values to the corresponding select 
function populateSelect(selectArray, selectID) {
    for (i = 0; i < selectArray.length; i++) {
        let option = document.createElement('option');
        option.text = selectArray[i];
        option.value = selectArray[i];
        let select = document.getElementById(selectID);
        select.appendChild(option);
    }
}

//Filtering the results based on current year selection and current genre selection
function filterYearAndGenre() {
    let selectedYear = document.getElementById('selectYear').value;
    let selectedGenre = document.getElementById('selectGenre').value;    
    let table, tr, tdGenre, tdYear, txtGenre, txtYear;
    let notDisplayedMovies = 0;

    table = document.getElementById('movieTable');
    tr = table.getElementsByTagName('tr');

    console.log('selectedYear: ' + selectedYear);
    console.log('selectGenre: ' + selectedGenre);

    //iterate through all table rows and set the styling of cells which do not match to none (unvisible)
    for (i = 0; i < tr.length; i++) {
        tdGenre = tr[i].getElementsByTagName('td')[2]; //Genre is at position 2
        tdYear = tr[i].getElementsByTagName('td')[0]; //Year is at positon 0 
        if (tdGenre && tdYear) {
            txtGenre = tdGenre.innerHTML;
            txtYear = tdYear.innerHTML;
            //When both selectors are set on 'All' display all movies
            if (selectedYear.indexOf('All') > -1 && selectedGenre.indexOf('All') > -1) {
                console.log('Display All')
                displayAll();
                break;
            } //When selected year and selected genre is not 'All' and a row matches the filters, then set the styling of the corresponding row to visible
            else if (txtYear.indexOf(selectedYear) > -1 && txtGenre.indexOf(selectedGenre) > -1) {
                tr[i].style.display = '';
            } //When selected year is 'All' and selected genre is not 'All' and a row matches the filters, then set the styling of the corresponding row to visible
            else if (selectedYear.indexOf('All') > -1 && txtGenre.indexOf(selectedGenre) > -1) {
                tr[i].style.display = '';
            } //When selected year is not 'All' and selected genre is 'All' and a row matches the filters, then set the styling of the corresponding row to visible
            else if (txtYear.indexOf(selectedYear) > -1 && selectedGenre.indexOf('All') > -1) {
                tr[i].style.display = '';
            }
            else {//When a row does not match the filter criteria, then set the styling of the corresponding row to none (unvisible)
                tr[i].style.display = 'none';
                notDisplayedMovies++; 
            }
        }
    }//function to give user information if the filters do not match any movie
    //isTableEmpty(notDisplayedMovies, tr.length);
}

//If the difference between not displayed movies and the tr amount is 1, it means that the filters did not match anything
function isTableEmpty(m, l) {
    if (l - m === 1) {
        alert('The filters do not match any movie!');
    }
}

//Extra function to display all movies
function displayAll() {
    let table, tr, td, txtValue;
    table = document.getElementById('movieTable');
    tr = table.getElementsByTagName('tr');
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName('td');
        if (td) {
            txtValue = td.innerHTML;
            tr[i].style.display = '';
        }
    }
}

function initialise() {
    var yearSelect = document.getElementById('selectYear');
    yearSelect.onchange = filterYearAndGenre;
    var genreSelect = document.getElementById('selectGenre');
    genreSelect.onchange = filterYearAndGenre;
    //extension task 1, see the rest of the code in 'movies-extension1.js'
    var searchCastButton = document.getElementById('searchCastButton');
    searchCastButton.onclick = search;
}

window.onload = initialise