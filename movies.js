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

function yearSelected() {
    var selectedYear = document.getElementById("selectYear").value;
    if (selectedYear.match("All")) {
        displayAllYears();
    } else {
        filterByYear(selectedYear);
    }
}

//https://www.w3schools.com/howto/howto_js_filter_table.asp
function filterByYear(year) {
    var table, tr, td, txtValue;
    table = document.getElementById("movieTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.innerHTML;
            console.log("textValue:" + txtValue);
            if (txtValue.indexOf(year) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function displayAllYears() {
    var table, tr, td, i, txtValue;
    table = document.getElementById("movieTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.innerHTML;
            tr[i].style.display = "";
        }
    }
}

function genreSelected() {
    var selectedGenre = document.getElementById("selectGenre").value;
    if (selectedGenre.match("All")) {
        displayAllGenres();
    } else {
        filterByGenre(selectedGenre);
    }
}

function filterByGenre(genre) {
    console.log("FilterByGenre: " + genre);
    var table, tr, td, txtValue;
    table = document.getElementById("movieTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2];
        if (td) {
            txtValue = td.innerHTML;
            if (txtValue.indexOf(genre) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function displayAllGenres() {
    console.log("Dispaly All genre");

    var table, tr, td, txtValue;
    table = document.getElementById("movieTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2];
        if (td) {
            txtValue = td.innerHTML;
            tr[i].style.display = "";
        }
    }
}

function initialise() {
    var yearSelect = document.getElementById("selectYear");
    yearSelect.onchange = yearSelected;
    var genreSelect = document.getElementById("selectGenre");
    genreSelect.onchange = genreSelected;
}

window.onload = initialise