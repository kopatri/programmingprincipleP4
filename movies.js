/* Test setting for Mozilla Firefox
about:config
privacy:file_unique_origin -> false
security.fileuri.strict_origin_policy -> false
*/
//constant to handle empty cells, will be outputed if a cell is empty
const emptyCell = "Not classified";

//fetch the movies data
fetch("movies.json")
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
        //Handling empty data sets for genres and cast
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


//Populating the select "selectYear" dynamically
function populateYearSelect(data) {
    let valuesYear = [];
    valuesYear.push("All");
    for (i = 0; i < data.length; i++) {
        //Checking if value is not already in the array
        if (valuesYear.indexOf(data[i].year) === -1) {
            valuesYear.push(data[i].year);
        }
    }
    //invoking method which populates the corresponding select
    populateSelect(valuesYear, "selectYear");
}

//Populating the select "genreYear" dynamically
function populateGenresSelect(data) {
    let valuesGenres = [];
    valuesGenres.push("All");
    for (i = 0; i < data.length; i++) {
        //Check if movies do not have a genre classification, if not then the empty cell value will be assigned
        console.log("Test: " + data[i].genres);
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
    //invoking method which populates the corresponding select
    populateSelect(valuesGenres, "selectGenre");
}

//displaying the values in the corresponsing select 
function populateSelect(selectArray, selectID) {
    for (i = 0; i < selectArray.length; i++) {
        let option = document.createElement("option");
        option.text = selectArray[i];
        option.value = selectArray[i];
        let select = document.getElementById(selectID);
        select.appendChild(option);
    }
}

//Filtering
//https://www.w3schools.com/howto/howto_js_filter_table.asp
function filter() {

    var selectedYear = document.getElementById("selectYear").value;
    var selectedGenre = document.getElementById("selectGenre").value;

    console.log("selectedYear: " + selectedYear);
    console.log("selectGenre: " + selectedGenre);

    var table, tr, tdGenre, tdYear, txtGenre, txtYear;
    var notDisplayedMovies = 0;

    table = document.getElementById("movieTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        tdGenre = tr[i].getElementsByTagName("td")[2]; //genre
        tdYear = tr[i].getElementsByTagName("td")[0]; //year
        if (tdGenre && tdYear) {
            txtGenre = tdGenre.innerHTML;
            txtYear = tdYear.innerHTML;
            //All & All
            if (selectedYear.indexOf("All") > -1 && selectedGenre.indexOf('All') > -1) {
                console.log("Display All")
                displayAll();
                break;
            } //Year + Genre
            else if (txtYear.indexOf(selectedYear) > -1 && txtGenre.indexOf(selectedGenre) > -1) {
                tr[i].style.display = "";
            } //All + Genre
            else if (selectedYear.indexOf("All") > -1 && txtGenre.indexOf(selectedGenre) > -1) {
                tr[i].style.display = "";
            } //Year + All
            else if (txtYear.indexOf(selectedYear) > -1 && selectedGenre.indexOf("All") > -1) {
                tr[i].style.display = "";
            }
            else {
                tr[i].style.display = "none";
                notDisplayedMovies++; //counting in here due to performance reasons. otherwiese external methods needs to count again
            }
        }
    }
    //isTableEmpty(notDisplayedMovies, tr.length, table);
}

function isTableEmpty(m, l) {
    if (l - m == 1) {
        alert("The filters do not match any movie!");
    }
}


function displayAll() {
    var table, tr, td, txtValue;
    table = document.getElementById("movieTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        if (td) {
            txtValue = td.innerHTML;
            tr[i].style.display = "";
        }
    }
}

function initialise() {
    var yearSelect = document.getElementById("selectYear");
    yearSelect.onchange = filter;
    var genreSelect = document.getElementById("selectGenre");
    genreSelect.onchange = filter;
}

window.onload = initialise