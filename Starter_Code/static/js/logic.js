// API key
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2022-11-02&endtime=2022-11-05&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";


//Take create json from the api and create a function with data.features as argument
d3.json(queryUrl).then(function (data) {
    createMap(
        findlocation(data.features)
        // createFeatures(data.features) 
        );
  });

  
// function createFeatures(earthquakeData) {

//     // Define a function that we want to run once for each feature in the features array.
//     // Give each feature a popup that describes the place and time of the earthquake.
//     function onEachFeature(feature, layer) {
//         layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
//     }
  
//     // Create a GeoJSON layer that contains the features array on the earthquakeData object.
//     // Run the onEachFeature function once for each piece of data in the array.
//     var earthquakes = L.geoJSON(earthquakeData, {
//       onEachFeature: onEachFeature
//     });
  
//     // Send our earthquakes layer to the createMap function/
//     return earthquakes;
//   }
function chooseColor(x) {
    if (x > 30.001) return "#800000";
    else if (x > 20.001) return "#FF0000";
    else if (x > 15.001) return "#FF6600";
    else if (x > 10.001) return "#FFFF00";
    else if (x > 5.001) return "#99CC00";
    else if (x > -10.001) return "#00FF00";
}

function findlocation(stuff) {

    return L.geoJSON(stuff, {
        style: function(feature) {
          return {    
          };
        
      },
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng,{
            color: "black",
            radius: 7.5 * feature.properties.mag,
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            fillOpacity: 1,
            weight: 1
          });
        },
        onEachFeature: function (feature, layer) {
            // Set the mouse events to change the map styling.
            layer.on({
              // When a user's mouse cursor touches a map feature, the mouseover event calls this function, which makes that feature's opacity change to 90% so that it stands out.
              mouseover: function(event) {
                layer = event.target;
                layer.setStyle({
                  fillOpacity: 0.5
                });
              },
              // When the cursor no longer hovers over a map feature (that is, when the mouseout event occurs), the feature's opacity reverts back to 50%.
              mouseout: function(event) {
                layer = event.target;
                layer.setStyle({
                  fillOpacity: 1
                });
              },
              // When a feature (neighborhood) is clicked, it enlarges to fit the screen.
            //   click: function(event) {
            //     myMap.fitBounds(event.target.getBounds());
            //   }
            });
            // Giving each feature a popup with information that's relevant to it
            layer.bindPopup("<h3>" + "Coordinates: " + feature.geometry.coordinates[1]+ " , " + feature.geometry.coordinates[0] + "</h3> <hr> <h4> Depth: " +
                feature.geometry.coordinates[2] + "</h4> <hr> <h4> Magnitude: " + feature.properties.mag + "</h4>"
            );
        }
    })
}

function createMap(
    // earthquakes, 
    eqlocale) {

  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Create a baseMaps object.
  var baseMaps = {
    "Earthquake Map": street
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    // Earthquakes: earthquakes,
    Earthquakesite: eqlocale,
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, 
        // earthquakes,
         eqlocale]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [">30.001","30-20.001","20-15.001","15-10.001","10-5.001","<5"];
    var colors = ["#800000","#FF0000","#FF6600","#FFFF00","#99CC00","#00FF00"];
    var labels = [];

    // Add the minimum and maximum.
    var legendInfo = "<h1>Earthquake Depth</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[limits.length - 1] + "</div>" +
        "<div class=\"max\">" + limits[0] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);

}