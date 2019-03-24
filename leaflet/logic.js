//Query End Points
var equakeEndPoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var plateEndPoint = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

/**
 * Multiply the scale with a constant to provide a large number.
 * This number is returned as the radius of the Circle that marks the earthquake.  
 * The radius and hence the size of the Circle varies with the proportion of the scale.
 * @param {*} scale 
 */
function markerSize(scale) {
    return scale * 20000;
}

//Create a Plate Layer.
var pLayer = new L.layerGroup();

//Perform a GET Request to access the relationship data
d3.json(plateEndPoint, function (geoJson) {
    console.log(geoJson);
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 2,
                color: 'magenta'
            }
        },
    }).addTo(pLayer);
});

//Perform a GET Request to the Earthquake End Point
d3.json(equakeEndPoint, function (data) {
    createFeatures(data);
});

/**
 * This function receives the Earthquake Data and returns a subset of the features:
 * scale
 * Place
 * Latitude
 * Longitude
 * @param {*} data 
 */
function createFeatures(data) {
    var latLongMag = data.features.map(function (feature) {
        return {
            "scale": feature.properties.mag,
            "Place": feature.properties.place,
            "Latitude": feature.geometry.coordinates[1],
            "Longitude": feature.geometry.coordinates[0]
        };
    });

    createMap(latLongMag);
}

/**
 * This function creates the Map along with Layers and Markers.
 * @param {*} latLongMag 
 */
function createMap(latLongMag) {
    // Define variables for our base layers
    var highContrastMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 13,
        id: "mapbox.high-contrast",
        accessToken: API_KEY
    });

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 13,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 13,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 13,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    //Create the Base Layer
    var baseLayers = {
        "High Contrast": highContrastMap,
        "Dark": darkMap,
        "Street": streetmap,
        "Satellite": satelliteMap
    };

    //Create Earth Quake Markers.
    var equakeMarkers = [];

    for (marker = 0; marker < latLongMag.length; marker++) {

        scale = latLongMag[marker].scale;
        place = latLongMag[marker].Place;
        latitude = latLongMag[marker].Latitude;
        longitude = latLongMag[marker].Longitude;
        color = '';

        showLogs();

        color = (scale <= 1) ? "#6d8643" : (scale <= 2) ? '#d1d41c' : (scale <= 3) ? '#be9b25' : (scale <= 4) ? '#e4a982' : (scale <= 5) ? '#a35d41' : '#f10909';

        equakeMarkers.push(
            // Create a red circle over Dallas
            L.circle([latLongMag[marker].Latitude, latLongMag[marker].Longitude], {
                color: "white",
                fillColor: color,
                fillOpacity: 0.9,
                radius: markerSize(latLongMag[marker].scale)
            }).bindPopup("<h4> Earthquake Information: </h4><hr><h5> scale: " + scale + "<br> Place: " + place + "</h5>")
        );

    }

    var equakeLayer = L.layerGroup(equakeMarkers);

    //Create the OverLays
    var overLays = {
        "Earthquakes": equakeLayer,
        "Plate Boundaries": pLayer
    };

    //Create the Map including Street and Earthquake Layers to be displayed on load.
    var myMap = L.map("map", {
        center: [
            37.774929, -122.419418
        ],
        zoom: 5,
        layers: [streetmap, equakeLayer, pLayer]
    });

    L.control.layers(baseLayers, overLays).addTo(myMap);

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            scale = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>scale</h4>"

        for (var i = 0; i < scale.length; i++) {
            color = (scale[i] + 1 <= 1) ? "#6d8643" : (scale[i] + 1 <= 2) ? '#d1d41c' : (scale[i] + 1 <= 3) ? '#be9b25' : (scale[i] + 1 <= 4) ? '#e4a982' : (scale[i] + 1 <= 5) ? '#a35d41' : '#f10909';

            console.log(`Color: ${color}`);

            div.innerHTML +=
                '<i style="background:' + color + '"></i> ' +
                scale[i] + (scale[i + 1] ? '&ndash;' + scale[i + 1] + '<br><br>' : '+');
        }

        return div;
    };
    legend.addTo(myMap);


    function showLogs() {
        console.log("===========================================================================================================================================");
        console.log(`${marker}`);
        console.log(`scale: ${scale}`);
        console.log(`Place: ${place}`);
        console.log(`Latitude: ${latitude}`);
        console.log(`Longitude: ${longitude}`);
        console.log("===========================================================================================================================================");
    }
}