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

		});