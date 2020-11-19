/* Test setting for Mozilla Firefox
about:config
privacy:file_unique_origin -> false
security.fileuri.strict_origin_policy -> false
*/

//fetch the movies data
fetch("movies-small.json")
    .then(response => response.json())
    .then(data => {

        populateTableWith(data);
        populateYearSelect(data)
        populateGenresSelect(data);

    })
    .catch(error => console.log(error));

//Populating the table dynamically
function populateYearSelect(data) {
    var duplicateValuesYear = [];
    duplicateValuesYear.push("All");
    for (i = 0; i < data.length; i++) {
        duplicateValuesYear.push(data[i].year);
    }
    var uniqueYears = Array.from(new Set(duplicateValuesYear));
    populateSelect(uniqueYears, "selectYear");
}

function populateGenresSelect(data) {
    duplicateValuesGenres = [];
    duplicateValuesGenres.push("All");
    for (i = 0; i < data.length; i++) {
        //Checking for Not classified movies
        if (data[i].genres.length == 0) {
            duplicateValuesGenres.push("Not classified");
        }
        for (k = 0; k < data[i].genres.length; k++) {
            duplicateValuesGenres.push(data[i].genres[k]);
        }
    }
    var uniqueGenres = Array.from(new Set(duplicateValuesGenres));
    populateSelect(uniqueGenres, "selectGenre");
}

function populateSelect(selectArray, selectID) {
    for (i = 0; i < selectArray.length; i++) {
        let option = document.createElement("option");
        option.text = selectArray[i];
        option.value = selectArray[i];
        let select = document.getElementById(selectID);
        select.appendChild(option);
    }
}

function populateTableWith(data) {
    var tbodyRef = document.getElementById('movieTable').getElementsByTagName('tbody')[0];
    //JSON is not in the same order as table rows
    for (i = 0; i < data.length; i++) {
        // Insert a row at the end of table
        var newRow = tbodyRef.insertRow();
        // Insert a cell at the end of the row
        var year = newRow.insertCell();
        // Append a text node to the cell
        year.appendChild(document.createTextNode(data[i].year));

        //Title row added
        var title = newRow.insertCell();
        title.appendChild(document.createTextNode(data[i].title));

        //Genres row added -> check if a genre is classified or not classified 
        var genres = newRow.insertCell();
        if (data[i].genres.length == 0) {
            genres.appendChild(document.createTextNode("Not classified"));
        } else {
            genres.appendChild(document.createTextNode(data[i].genres));
        }


        //Cast row added
        var cast = newRow.insertCell();
        cast.appendChild(document.createTextNode(data[i].cast));
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