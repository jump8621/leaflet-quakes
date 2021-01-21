var geoJsonLayer;
// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"; 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

var tectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Initialize  & Create all of the LayerGroups we'll be using:
var WorldEarthquakes = new L.LayerGroup();
var TectoncPlates = new L.LayerGroup();
var heatLayer = new L.LayerGroup();


// Define Variables for Tile Layers
var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// var Thunderforest_Landscape = L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={apikey}', {
//     attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     apikey: '<your apikey>',
//     maxZoom: 22
// });

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var Esri_OceanBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
    maxZoom: 13
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});


// Define baseMaps Object to Hold Base Layers
// "Forest Landscape": Thunderforest_Landscape,
var baseMaps = {
    "Light Map": lightMap,
    "Dark Map": darkmap,
    "Topography Map": OpenTopoMap,
    "Esri World Imagery": Esri_WorldImagery,
    "Esri Ocean Base": Esri_OceanBasemap
};

// Create an overlays object to add to the layer control
var overlays = {
    "Earth Quake Magnitude": WorldEarthquakes,
    "Tectonic Plates": TectoncPlates,
    "Heat Map": heatLayer
};

//Create Map and Default layers to display on Load
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [lightMap, WorldEarthquakes]
});

// Create a control for our layers, add our overlay layers to it
L.control.layers(baseMaps, overlays).addTo(myMap);

// var WaymarkedTrails_hiking = L.tileLayer('https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png', {
// 	maxZoom: 18,
// 	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
// });
// var WaymarkedTrails_cycling = L.tileLayer('https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', {
// 	maxZoom: 18,
// 	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
// });
// var OpenFireMap = L.tileLayer('http://openfiremap.org/hytiles/{z}/{x}/{y}.png', {
// 	maxZoom: 19,
// 	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="http://www.openfiremap.org">OpenFireMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
// });
// var OpenRailwayMap = L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
// 	maxZoom: 19,
// 	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
// });

d3.json(queryUrl, function (data) {

    data.features.forEach((element) => {
        color = "red";
        // Conditionals for countries points
        if (element.properties.mag > 6) {
            color = "#5f0000";
        } else if (element.properties.mag > 5) {
            color = "Maroon";
        } else if (element.properties.mag > 4) {
            color = "purple";
        } else if (element.properties.mag > 3) {
            color = "MediumVioletRed";
        } else if (element.properties.mag > 2) {
            color = "Fuchsia";
        } else if (element.properties.mag > 1) {
            color = "Teal";
        } else if (element.properties.mag > 0) {
            color = "green";
        } else if (element.properties.mag > -1) {
            color = "Olive";
        }
        //   var geoJsonLayer = 
        // Add circles to map
        L.circle([element.geometry.coordinates[1], element.geometry.coordinates[0]], {
            fillOpacity: 0.7,
            color: color,
            fillColor: color,
            radius: element.properties.mag * 3000,
        }).bindPopup(`
        <h2>${element.properties.place}</h2><hr>
        <h4>${new Date(element.properties.time)}</h4>
        <p><b> Quake Magnitude: ${element.properties.mag} </b></p>
        <p><b> # who felt quake: ${element.properties.felt} </b></p>
        `).addTo(WorldEarthquakes);
        //.addTo(WorldEarthquakes); ;
        // geoJsonLayer.addLayer(WorldEarthquakes);
        // Adjust radius
        //adding data to layerGroup
    })
    //adding layer to map
    WorldEarthquakes.addTo(myMap);

    heatArray = []

    data.features.forEach((element) => {

        heatArray.push([element.geometry.coordinates[1], element.geometry.coordinates[0]])

    })

    L.heatLayer(heatArray, {
        radius: 50,
        blur: 15,
        gradient: {0.1: 'blue', 1: 'red'}
    }).addTo(heatLayer);
    heatLayer.addTo(myMap)

    d3.json(tectonicPlatesUrl, function (plateData) {
        //Create a GeoJson Layer from the plate data
        L.geoJson(plateData, {
            color: "#0087af",
            weight: 2
            //add plateData to LayerGroup
        }).addTo(TectoncPlates)
        //add layer to map
        TectoncPlates.addTo(myMap)
    })


    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend');
        labels = ['<strong>EarthQuake Magnitude</strong>'],
            categories = ['6.0 or greater', '5-5.9', '4-4.9', '3-3.9', '2-2.9', '1-1.9', '0-0.9', '-1-(-0.1)'],
            // colors= ["Maroon", "Purple", "#5f0000", "red", "Fuchsia", "Olive", "Teal", "Green"]"#ff0000"
            colors = ["#5f0000", "#800000", "#800080", "#af0087", "#ff00ff", "#008080", "#008000", "#808000"];
        div.innerHTML = ""
        for (var i = 0; i < categories.length; i++) {

            labels.push(
                '<div class="circle" style="height:20px; width:20 px; background: ' + (colors[i] ? colors[i] : '+') + '"></div> ' +
                (categories[i] ? categories[i] : '+'));
            console.log(categories[i])
            console.log(colors[i])

        }
        div.innerHTML = labels.join('<br>');
        return div;



    };

    // Adding legend to the map
    legend.addTo(myMap);


});
