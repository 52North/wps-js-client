angular.module('wpsMap', []);

/**
 * a common serviceInstance that holds all needed properties and methods for
 * interacting with a map (openlayers).
 */
angular.module('wpsMap').service(
		'wpsMapService',
		function() {

      // central map object
			this.map;
			
			this.outputStyle = {
				    "color": "#ff7800",
				    "weight": 5,
				    "opacity": 0.65
				};

			this.initializeMap = function() {

		        // initialize map referring to div element with id="map"
		        this.map = L.map('map').setView([51.95, 7.63], 13);
		      
		        // create OSM tile layer with correct attribution
		        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		        var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
		        var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 19, attribution: osmAttrib}).addTo(this.map);		
		      
			}
      
      // here include other methods for map interaction 
      // (like drawing or selecting geometries or enable/disable map editing)

			this.visualizeGeometricOutputs = function(geometricOutputs){
				for (var i=0; i < geometricOutputs.length; i++){
					this.addGeometricOutputToMap(geometricOutputs[i]);
				}
			};
			
			this.addGeometricOutputToMap = function(geometricOutput){
				/*
				 * output may be complex output or bbox output
				 */
				
				if(geometricOutput.data)
					this.addComplexOutputToMap(geometricOutput);
				
				else if(geometricOutput.boundingBox)
					this.addBboxOutputToMap(geometricOutput);
				
				else
					// should never reach this line; error
					return null;
			};
			
			this.addComplexOutputToMap = function(geometricOutput){
				/*
				 * format will be GeoJSON. Hence we can add a GeoJSON layer
				 */
				
				var geoJSONString = geometricOutput.data.complexData.value;
				
				var geoJSONFeature = JSON.parse(geoJSONString);
				
				var geoJSONLayer = L.geoJSON(geoJSONFeature, {style: this.outputStyle, 
					onEachFeature: this.onEachFeature_output});
				
				geoJSONLayer.addTo(this.map);
				
				this.map.fitBounds(geoJSONLayer.getBounds());
			};
			
			this.addBboxOutputToMap = function(geometricOutput){
				
			};
			
			this.onEachFeature_output = function(feature, layer) {
			    // does this feature have a property named popupContent?
			    if (feature.properties.popupContent) {
			        layer.bindPopup('' + feature.properties.popupContent);
			    }
			};
			
		});