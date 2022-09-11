$(document).ready(function () {
  // get all the years from 2018 - now
  getYears();
});

function getYears() {
  // console.log("the telem type is: "+telemType);
  var currentTime = new Date();
  var year = currentTime.getFullYear();
  var start = 2018;
  var difference = year - start;
  var years = [];
  var formYearItem = "";
  for (var i = 0; i < difference + 1; i++) {
    years.push(start + i);
    // console.log(years)
  }
  for (var x = 0; x < difference + 1; x++) {
    // creating an input item for each race
    formYearItem +=
      "<input " +
      " id=" +
      "yearValue" +
      " " +
      "name=" +
      "year" +
      " " +
      "type=button" +
      " value=" +
      years[x] +
      " " +
      "onclick=" +
      "getRaces(" +
      years[x] +
      ")" +
      " " +
      years[x] +
      ">" +
      "</button>" +
      "<br>";
  }
  
  $("#yearlist").append(formYearItem);
}

function getRaces(year) {
  var yearUrl = "https://ergast.com/api/f1/" + year + ".json";
  var newButton =
    "<input " +
    "id=" +
    "selectedYear" +
    " " +
    "data-toggle= " +
    "tooltip" +
    " " +
    "title='click to reset'" +
    " " +
    "name=" +
    "placeholder" +
    " " +
    "type=button" +
    " value=" +
    year +
    " onclick=" +
    " location.reload(" +
    ")" +
    " " +
    "</button>";
  $.getJSON(yearUrl, function (jsondata) {
    getYearData(jsondata);
  });
  $("#yearlist").remove();
  $("#yearHolder").append(newButton);
}

function getYearData(jsondata) {
  var storeTracks = [];
  var year = jsondata.MRData.RaceTable.season;
  var listableItem = "";
  for (var i = 0; i < parseInt(jsondata.MRData.total); i++) {
    storeTracks.push(
      jsondata.MRData.RaceTable.Races[i].raceName.replace(/ /g, "-")
    );
    listableItem +=
      "<input " +
      " id=" +
      parseInt(i + 1) +
      " " +
      "name=" +
      "raceName" +
      " " +
      "type=button" +
      " value=" +
      storeTracks[i] +
      " " +
      "onclick=" +
      "getDrivers(" +
      parseInt(i + 1) +
      "," +
      year +
      "," +
      "'" +
      storeTracks[i] +
      "'" +
      ")" +
      " " +
      storeTracks[i] +
      ">" +
      "</button>" +
      "<br>";
  }
  $("#racelist").append(listableItem);
}

async function getAdjustedCircuitNames(jsondata) {
  var storeTracks = [];
  var listableItem = "";
  var currentRaceName =
    jsondata.MRData.CircuitTable.Circuits[0].circuitName.replace(/ /g, "-");
  storeTracks.push(currentRaceName);
  console.log(currentRaceName);
  for (var i = 0; i < storeTracks.length; i++) {
    listableItem +=
      "<input " +
      " id=" +
      parseInt(jsondata.MRData.CircuitTable.round) +
      " " +
      "name=" +
      "raceName" +
      " " +
      "type=button" +
      " value=" +
      storeTracks[i] +
      " " +
      "onclick=" +
      "getDrivers(" +
      parseInt(jsondata.MRData.CircuitTable.round) +
      "," +
      "2020" +
      "," +
      "'" +
      storeTracks[i] +
      "'" +
      ")" +
      " " +
      storeTracks[i] +
      ">" +
      "</button>" +
      "<br>";
  }
  $("#racelist").append(listableItem);
}

function getDrivers(round, year, raceString) {
  var driverUrl =
    "https://ergast.com/api/f1/" + year + "/" + round + "/drivers.json";
  // console.log("The race name in getDrivers is: "+raceString);
  var raceSelected =
    "<input " +
    "id=" +
    "selectedRace" +
    " " +
    "data-toggle= " +
    "tooltip" +
    " " +
    "title='click to reset'" +
    " " +
    "name=" +
    "placeholder" +
    " " +
    "type=button" +
    " value=" +
    raceString +
    " onclick=" +
    " location.reload(" +
    ")" +
    " " +
    "</button>";
  $("#racelist").remove();
  $("#raceHolder").append(raceSelected);
  $.getJSON(driverUrl, function (jsondata) {
    getDriversOptions(jsondata, year, round);
  });
}

function getDriversOptions(jsondata, year, round) {
  // console.log("round in final: " + round + " year in the final is: " + year);
  var driverItem = "";
  var storeDrivers = [];
  for (var i = 0; i < parseInt(jsondata.MRData.total); i++) {
    storeDrivers.push(jsondata.MRData.DriverTable.Drivers[i].code);
    var driverCurrently = jsondata.MRData.DriverTable.Drivers[i].code;
    driverItem +=
      "<input " +
      " id=" +
      driverCurrently +
      " " +
      "name=" +
      "driverName" +
      " " +
      "type=button" +
      " value=" +
      driverCurrently +
      " " +
      "onclick=" +
      "passDriver(" +
      year +
      "," +
      round +
      "," +
      "'" +
      driverCurrently +
      "'" +
      ")" +
      " " +
      driverCurrently +
      ">" +
      "</button>" +
      "<br>";
  }
  $("#driverlist").append(driverItem);
}

function passDriver(year, round, driver) {
  var driverSelected =
    "<input " +
    "id=" +
    "selectedDriver" +
    " " +
    "data-toggle= " +
    "tooltip" +
    " " +
    "title='click to reset'" +
    " " +
    "name=" +
    "placeholder" +
    " " +
    "type=button" +
    " value=" +
    driver +
    " onclick=" +
    " location.reload(" +
    ")" +
    " " +
    "</button>";
  $("#driverlist").remove();
  $("#driverHolder").append(driverSelected);
  // $('#hiddenSubmit').append('<input type="hidden" name="hiddenValue" value="myvalue" />');

  post({ driver: driver, round: round, year: year });
}



function post(params) {
  url = "/getGraph";
  fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      driverData: {
        driverName: params.driver,
        raceNumber: params.round,
        yearNumber: params.year,
      },
    }),
  })
    .then((res) => {
      // response for debugging
      console.log("The response given is: ", res);
    })
    .catch((err) => {
      // error handling print
      console.log("The given error was: ", error);
    });
}
