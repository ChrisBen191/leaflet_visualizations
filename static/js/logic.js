// Store our API endpoint inside queryUrl
var queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);    // data.features is where earthquake data is held
  // console.log(data.features);
});

function createFeatures(earthquakeData) {



  // Created a for loops to iterate through each item in the properties object
  // Give each feature a popup describing the place and magnitude of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("hi");
    // created a dict to store the name, location, and magnitude of each earthquake
    earthquakes = {}

    // stored the coordinates of earthquakes (as int) in variable, to 2 decimal places
    let lng =parseFloat( feature.geometry.coordinates[0].toFixed(2));
    let lat =parseFloat(feature.geometry.coordinates[1].toFixed(2));
    let coordinates = [lat,lng];
    earthquakes["location"] = coordinates;

    // stored the magnitude of earthquakes (as int) in variable
    let magnitude = feature.properties.mag;
    earthquakes["magnitude"] = magnitude;

    // stored the name of each earthquake and a descripton of where it occured
    let name = feature.properties.place;
    earthquakes['name'] = name;

    // Loop through the cities array and create one marker for each city object
    for (var i = 0; i < earthquakes.length; i++) {
      
      // layer.circle(earthquakes[i].location, {
      //   fillOpacity: 0.75,
      //   color: "white",
      //   fillColor: "purple",
      //   // Setting our circle's radius equal to the output of our markerSize function
      //   // This will make our marker's size proportionate to its population
      //   radius: markerSize(cities[i].magnitude)
      // }).bindPopup("<h1>" + cities[i].name + "</h1> <hr> <h3>Magnitude: " + cities[i].magnitude + "</h3>").addTo(myMap);
    }


  console.log(earthquakes);



//  Closing bracet to the 'onEachFeature' function
  }




  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  }); 

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define basicMap layer
  var basicMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Basic Map": basicMap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [basicMap, earthquakes]
  });  

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
