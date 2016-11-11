angular.module('wpsMap', []);
/**
 * a common serviceInstance that holds all needed properties and methods for
 * interacting with a map (openlayers).
 */
angular.module('wpsMap').service(
		'wpsMapService',
		[ 'leafletData', '$rootScope', function(leafletData, $rootScope) {

/**
    // central map object
    this.map;
                  
    this.drawnItems;
    this.initializeMap = function () {

        // initialize map referring to div element with id="map"
        this.map = L.map('map', {drawControl: true}).setView([51.95, 7.63], 13);
                    
        // create OSM tile layer with correct attribution
        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 19, attribution: osmAttrib}).addTo(this.map);
                    
        // Initialise the FeatureGroup to store editable layers
        this.drawnItems = new L.FeatureGroup();
        this.map.addLayer(this.drawnItems);
        // Initialise the draw control and pass it the FeatureGroup of editable layers
        var drawControl = new L.Control.Draw({
            edit: {
                featureGroup: this.drawnItems
            }
        });
        this.map.addControl(drawControl);      
            };
*/
			
			  this.geoJSONLayer;
      
		      this.outputStyle = {
						    "color": "#ff7800",
						    "weight": 5,
						    "opacity": 0.65
						};
		
					this.visualizeGeometricOutputs = function(geometricOutputs){
						
						/*
						 * basic name for layer property
						 * 
						 * important if we add multiple layers as overlays,
						 * since each layer has to be defined as unique property
						 */
						var baseNameForLayerProperty = 'output';
						
						for (var i=0; i < geometricOutputs.length; i++){
							
							var currentNameForLayerProperty = baseNameForLayerProperty + '_' + i;
							
							this.addGeometricOutputToMap(geometricOutputs[i], currentNameForLayerProperty);
						}
					};
					
					this.addGeometricOutputToMap = function(geometricOutput, currentNameForLayerProperty){
						/*
						 * output may be complex output or bbox output
						 */
						
						if(geometricOutput.data)
							this.addComplexOutputToMap(geometricOutput, currentNameForLayerProperty);
						
						else if(geometricOutput.boundingBox)
							this.addBboxOutputToMap(geometricOutput, currentNameForLayerProperty);
						
						else
							// should never reach this line; error
							return null;
					};
					
					this.addComplexOutputToMap = function(geometricOutput, currentNameForLayerProperty){
						/*
						 * format will be GeoJSON. Hence we can add a GeoJSON layer
						 */
						
						var geoJSONString = geometricOutput.data.complexData.value;
						
						var geoJSONFeature = JSON.parse(geoJSONString);
						
						var outputIdentifier = geometricOutput.identifier;
						
						/*
						 * calls the associated event/method from wps-map controller!
						 */
						$rootScope.$broadcast("addGeoJSONOutput", 
								{ geoJSONFeature: geoJSONFeature,
								  layerPropertyName: currentNameForLayerProperty,
								  outputIdentifier: outputIdentifier});

					};
					
					this.addBboxOutputToMap = function(geometricOutput, currentNameForLayerProperty){
						
					};
			
		}]);