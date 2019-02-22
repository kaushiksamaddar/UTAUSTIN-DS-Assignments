// from data.js
var tableData = data;

//Get the reference to the Table Body
var tbody = d3.select("tbody")

var resetData = function (tbd) {
    //Iterate the Data for each dictionary.
    tableData.forEach((tableData) => {
        //Create a reference to a table row.
        var row = tbd.append("tr")
        //Unpack the dictionary into keys and values.
        //Create and get the reference to every cell in the row.
        //Populate the cell with an unpacked value.
        Object.entries(tableData).forEach(([key, value]) => {
            //console.log(`For Key: ${key}, the value is : ${value}`);
            var cell = tbd.append("td")
            cell.text(value)
        })
    });
};

resetData(tbody);

//Filter for date/time based on User Input.
//Get the reference to the Filter Button.
filterBtn = d3.select("#filter-btn")

filterBtn.on("click", function () {
    d3.event.preventDefault();
    searchData = d3.select("#datetime").property('value')
    console.log(`Date Entered : ${searchData}`)

    //Get the value from the combo box
    selectCriteria = d3.select("#nav-select").property('value')
    console.log(`Criteria specified: ${selectCriteria} `)

    console.log(`thisData.${selectCriteria}`)

    //Filter the table as per the date entered by the user
    var dataFiltered = tableData.filter(thisData => thisData[selectCriteria] === searchData)
    //console.log(dataFiltered)

    //Remove the Table Body to accommodate only the Filtered Data.
    d3.select("tbody").remove();

    //Create the Table Body again with just the cells to populate the Filtered Data.
    var tbody = d3.select("#ufo-table").append("tbody")

    //Iterate the Data for each dictionary.
    dataFiltered.forEach((tableData) => {
        //Create a reference to a table row.
        var row = tbody.append("tr")

        //Unpack the dictionary into keys and values.
        //Create and get the reference to every cell in the row.
        //Populate the cell with an unpacked value.
        Object.entries(tableData).forEach(([key, value]) => {
            //console.log(`For Key: ${key}, the value is : ${value}`);
            var cell = tbody.append("td")
            cell.text(value)
        })
    });

});

resetBtn = d3.select("#reset-btn")

resetBtn.on("click", function(){
    d3.event.preventDefault();
    d3.select("tbody").remove();
    
    //Create the Table Body again with just the cells to populate the Filtered Data.
    var tbody2 = d3.select("#ufo-table").append("tbody")

    resetData(tbody2);

});
