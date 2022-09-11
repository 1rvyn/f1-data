$(function () {
  getResultsFromErgastApi();
});

// get the drivers information for the current year

function getResultsFromErgastApi() {
  // construct the URL to make the API request
  var currentTime = new Date();
  var year = currentTime.getFullYear();

  var driverUrl = "https://ergast.com/api/f1/" + year + "/driverStandings.json";

  var teamYearUrl =
    "https://ergast.com/api/f1/" + year + "/constructorStandings.json";

  var currentRacesUrl = "https://ergast.com/api/f1/current.json";
  // use jquery to handle getting the json

  $.getJSON(driverUrl, function (jsondata) {
    // handle the results
    getDriverPoints(jsondata);
  });

  $.getJSON(teamYearUrl, function (jsondata) {
    getTeamData(jsondata);
  });

  $.getJSON(currentRacesUrl, function (jsondata) {
    getCurrentRaces(jsondata);
  });

  function getDriverPoints(jsondata) {
    //empty the results element
    // array for storing amount of driver points
    var listItem = "";
    var arrPoint = [],
      lenPointArr;
    var storePoints = [];
    var storeWins = [];
    var storePositions = [];
    var storeDriverCodeNames = [];

    for (key in jsondata.MRData.StandingsTable.StandingsLists[0]
      .DriverStandings) {
      arrPoint.push(key);
    }
    // set the lenPointArr var to the length of the arrPoint array (21)
    lenPointArr = arrPoint.length; // loop how ever many times and then append the points to a list
    for (var i = 0; i < lenPointArr; i++) {
      var point =
        jsondata.MRData.StandingsTable.StandingsLists[0].DriverStandings[i]
          .points;
      var win =
        jsondata.MRData.StandingsTable.StandingsLists[0].DriverStandings[i]
          .wins;
      var position =
        jsondata.MRData.StandingsTable.StandingsLists[0].DriverStandings[i]
          .position;
      var codeName =
        jsondata.MRData.StandingsTable.StandingsLists[0].DriverStandings[i]
          .Driver.code;

      // push to array
      storeWins.push(win);
      storePoints.push(point);
      storePositions.push(position);
      storeDriverCodeNames.push(codeName);
      // create the item to display the data
      listItem +=
        "<li" +
        " id=" +
        "driverItem" +
        i +
        ">" +
        position +
        ") " +
        codeName +
        " | " +
        "Points : " +
        point +
        " | " +
        "Wins : " +
        win +
        " " +
        "</li>";
    }
    for (var c = 0; c < 10; c++) {
      var listHomePageItem = "";
      // only show first 10 to make it neater
      listHomePageItem +=
        "<li>" +
        storePositions[c] +
        ") " +
        storeDriverCodeNames[c] +
        " | " +
        "Points : " +
        storePoints[c] +
        " | " +
        "Wins : " +
        storeWins[c] +
        " " +
        "</li>";
      $("#drivers").append(listHomePageItem);
    }
    $("#driversData").append(listItem);
  }

  function getTeamData(jsondata) {
    var listConstructor = "";
    var numberConstructors = [],
      lenNumConst;
    var storeConstId = [];
    var storeConstName = [];
    var storeConstNation = [];
    var storeConstPoints = [];
    var storeConstPos = [];
    var storeConstWins = [];

    for (key in jsondata.MRData.StandingsTable.StandingsLists[0]
      .ConstructorStandings) {
      numberConstructors.push(key);
    }

    lenNumConst = numberConstructors.length;

    for (var j = 0; j < lenNumConst; j++) {
      var constructorId =
        jsondata.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[j]
          .Constructor.constructorId;
      var constructorName =
        jsondata.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[j]
          .Constructor.name;
      var constructorNationality =
        jsondata.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[j]
          .Constructor.nationality;
      var constructorPoints =
        jsondata.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[j]
          .points;
      var constructorPosition =
        jsondata.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[j]
          .position;
      var constructorWins =
        jsondata.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[j]
          .wins;

      storeConstId.push(constructorId);
      storeConstName.push(constructorName);
      storeConstNation.push(constructorNationality);
      storeConstPoints.push(constructorPoints);
      storeConstPos.push(constructorPosition);
      storeConstWins.push(constructorWins);

      listConstructor +=
        "<li>" +
        constructorName +
        ":" +
        " " +
        constructorPoints +
        " | " +
        "Position: " +
        constructorPosition +
        "th" +
        " | " +
        constructorWins +
        " Wins " +
        " | " +
        constructorNationality +
        " " +
        "</li>";
    }
    $("#teamsData").append(listConstructor);
    $("#teams").append(listConstructor);
  }

  function getCurrentRaces(jsondata) {
    var listRaces = "";

    var numberRaces = [],
      lenNumRaces;
    var storeCircutCountry = [];
    var storeCircutId = [];
    var storeCircutName = [];
    var storeCircutDate = [];
    var storeCircutRound = [];
    var storeCircutTime = [];

    for (key in jsondata.MRData.RaceTable.Races) {
      numberRaces.push(key);
    }
    lenNumRaces = numberRaces.length;

    for (var f = 0; f < lenNumRaces; f++) {
      var circutCountry =
        jsondata.MRData.RaceTable.Races[f].Circuit.Location.country;
      var circutId = jsondata.MRData.RaceTable.Races[f].Circuit.circuitId;
      var circutName = jsondata.MRData.RaceTable.Races[f].Circuit.circuitName;
      var circutDate = jsondata.MRData.RaceTable.Races[f].date;
      var circutRound = jsondata.MRData.RaceTable.Races[f].round;
      var circutTime = jsondata.MRData.RaceTable.Races[f].time;

      storeCircutCountry.push(circutCountry);
      storeCircutId.push(circutId);
      storeCircutName.push(circutName);
      storeCircutDate.push(circutDate);
      storeCircutRound.push(circutRound);
      storeCircutTime.push(circutTime);

      listRaces +=
        "<li>" +
        circutRound +
        ") " +
        circutName +
        " | " +
        circutDate +
        " | " +
        circutTime +
        " | " +
        circutId +
        " | " +
        circutCountry +
        " " +
        "</li>";
    }

    // only showing the first 10 on the home page
    for (var x = 0; x < 10; x++) {
      var listHomePageRaces = "";
      listHomePageRaces +=
        "<li>" +
        storeCircutRound[x] +
        ") " +
        storeCircutName[x] +
        " | " +
        storeCircutDate[x] +
        " | " +
        storeCircutTime[x] +
        " | " +
        storeCircutId[x] +
        " | " +
        storeCircutCountry[x] +
        " " +
        "</li>";
      $("#races").append(listHomePageRaces);
    }

    $("#racesData").append(listRaces);
  }
}
