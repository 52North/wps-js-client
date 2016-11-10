angular.module('wpsMap', []);
/**
 * a common serviceInstance that holds all needed properties and methods for
 * interacting with a map (openlayers).
 */
angular.module('wpsMap').service(
        'wpsMapService',
        function ($rootScope, $timeout) {
            
            this.a = 0;
            
            this.testMapToService = function(b){
                console.log("function testMapToService has been called.");
                this.a = b;
            };
            
            // run function on mapscope via $rootScope.$broadcast:
            $timeout(function () {
                console.log("calling trigger-map-event-blub123 from wpsMapService...");
                $rootScope.$broadcast('trigger-map-event-blub123', {'paramA': 3, 'paramB': 4});
                            }, 2000);
            
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
                
            };*/
            
            // here include other methods for map interaction 
            // (like drawing or selecting geometries or enable/disable map editing)

        });