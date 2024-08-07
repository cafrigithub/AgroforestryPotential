window.onload = init;

function init(){
// Define a view
var view = new ol.View({
    projection:'EPSG:4326',
    center : [93,26.05], //Coordinates of center
    zoom : 7.5 //zoom level of map
})

//Define basemap
// var OSMBaseMap = new ol.layer.Tile({
//     source: new ol.source.OSM({
//         wrapX: false
//       })
//   })

var OSMBaseMap = new ol.layer.Tile({ 
    source: new ol.source.XYZ({ 
        url:'http://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    })
});


// Define array of layers
var layerArray = [OSMBaseMap]

// Define our map
var map = new ol.Map({
    target:'map',
    layers:layerArray,
    view : view
})

// Adding vector layer from geojson file
var extSource = new ol.source.Vector({
    format : new ol.format.GeoJSON(),
    // url:'geom.geojson'
    url : 'assets/AssamAgfData333.geojson'
    // url : 'http://localhost:8080/geoserver/tiger/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tiger%3Apoly_landmarks&maxFeatures=50&outputFormat=application%2Fjson'
})

var styles = function(extLayer,resolution) {
    if (extLayer.get('Area_sqkm2') < 400) {color = 'rgb(255, 157, 0, 0.5)' ;}
        else if (extLayer.get('Area_sqkm2') >= 401 && extLayer.get('Area_sqkm2') <= 800){color ='rgb(255, 251, 0, 0.5)';}
        else if (extLayer.get('Area_sqkm2') >= 801 && extLayer.get('Area_sqkm2')<= 1200){color ='rgb(212, 255, 0, 0.5)';}
        else if (extLayer.get('Area_sqkm2') >= 1201 && extLayer.get('Area_sqkm2')<= 1600){color ='rgb(132, 255, 0, 0.5)';}
        else if (extLayer.get('Area_sqkm2') >= 1601 && extLayer.get('Area_sqkm2')<= 2000){color ='rgb(0, 255, 102, 0.5)';}
        else {color = '#fff5eb';}

       return  [
       new ol.style.Style({
         stroke: new ol.style.Stroke({
           color: 'black',
           width: 0.7,
         }),
         fill: new ol.style.Fill({
           color: color,
         }),
       }),
     ]
   }
var extLayer = new ol.layer.Vector({
    source:extSource,
    style : styles,
    
})
map.addLayer(extLayer)

// Vector Feature Popup Information
const overlayContainerElement = document.querySelector('.overlay-container')
const overlayLayer = new ol.Overlay({
  element: overlayContainerElement
})
map.addOverlay(overlayLayer);
const overlayFeatureName = document.getElementById('feature-name');
const overlayFeatureAdditionInfo = document.getElementById('feature-additional-info');


// Vector Feature Popup Logic
map.on('pointermove', function(e){
  overlayLayer.setPosition(undefined);
  map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
    let clickedCoordinate = e.coordinate;
    let clickedFeatureName = feature.get('District2');
    let clickedFeatureAdditionInfo = feature.get('Agroforest');
    if(clickedFeatureName && clickedFeatureAdditionInfo != undefined){
      overlayLayer.setPosition(clickedCoordinate);
      overlayFeatureName.innerHTML = clickedFeatureName;
      overlayFeatureAdditionInfo.innerHTML = clickedFeatureAdditionInfo;
    }
  })
})
}
