// API key
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2022-11-02&endtime=2022-11-04&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";


//Take create json from the api and create a function with data.features as argument
d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
    findlocation(data.location);
  });

function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }

function findlocation(stuff) {
    // console.log(stuff);

    var eqsite = [];

    for(var i = 0; i < stuff.length; i++) {
        var location = stuff[i].location;
        
        if(location){
            eqsite.push([location.coordinates[1], location.coordinates[0]]);
        }
    }
    var eqcircle = L.circle(eqsite, {
        color: "green",
        fillcolor: "green",
        fillopacity: 0.25,
        radius: 70
    });
  createMap(eqlocale);
}



function createMap(earthquakes, eqlocale) {

  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Create a baseMaps object.
  var baseMaps = {
    "Earthquake Map": street
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes,
    Earthquakesite: eqlocale,
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes, eqlocale]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}