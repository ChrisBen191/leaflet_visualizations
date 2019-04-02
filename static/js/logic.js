////// stored the API endpoint inside queryUrl
var queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//////  created a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

////////////////// 



////// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  var features = data.features; 
  
  ////// created an empty list to hold all of the earthquake objects
  var earthquakes = [];
  
  ////// looping over each 'feature' or recorded event //////////////////////////////
  for (var i = 0; i < features.length; i++) {
    
    ////// stored the name/location of each event
    var name = features[i].properties.place;
    
    ////// stored the magnitude of each event
    var magnitude = features[i].properties.mag;
    
    ////// stored the coordinates of each event
    let lng =parseFloat( features[i].geometry.coordinates[0].toFixed(2));
    let lat =parseFloat(features[i].geometry.coordinates[1].toFixed(2));
    var coordinates = [lat,lng];
    
    ////// created a constructor function to create an earthquakes list of event objects
    function Earthquake(name, magnitude, coordinates) {
      this.name = name; 
      this.magnitude = magnitude;
      this.coordinates = coordinates;
    }
    
    ////// called the constructor and pushed the created object to the earthquakes list
    earthquakes.push(new Earthquake(name, magnitude, coordinates));
    
  }  ////// this is the closing bracket for the for loop  /////////////////////////////////////////
  
  ////// pass each earthquake magnitude through the quakeSize function to normalize
  function quakeSize(magnitude) {
    return (15000 * magnitude);
  }
  
////////  used the choropleth method to create quakeColor function to gradient earthquakes
  function quakeColor(magnitude) {
    return magnitude < 1  ? "#168f48" :
    magnitude >=1 && magnitude <2  ? "#e1f34d" :
    magnitude >=2 && magnitude <3  ? "#f3db4d" :
    magnitude >=3 && magnitude <4  ? "#f3ba4d" :
    magnitude >=4 && magnitude <5  ? "#f0a76b" :
                                      "FF0000";
  }   ////// https://leafletjs.com/examples/choropleth/
  
  ////// for loop to create each circle on the map
  for (var i = 0; i < earthquakes.length; i++) {
    L.circle(earthquakes[i].coordinates, {
      color: quakeColor(earthquakes[i].magnitude), // need to create a color function giving the different scales 
      radius: quakeSize(earthquakes[i].magnitude),
    }).bindPopup("<h3>" + earthquakes[i].name +"</h3><hr><p> Magnitude: " + earthquakes[i].magnitude + "</p>")
    .addTo(myMap);
  }
  
  
  }    ////// this is the closing bracket for the d3.json function parameter  /////////////////////////////////////////
);     ////// this is the closing bracket to 'd3.json' request  /////////////////////////////////////////





