angular.module('wpsMap').component(
        'wpsMap',
        {
            templateUrl: "components/wpsUserInterface/wpsMap/wps-map.template.html",
            controller: [
                '$rootScope',
                '$scope',
                '$timeout',
                'wpsMapService',
                'leafletData',
                function MapController($rootScope, $scope, $timeout, wpsMapService, leafletData, leafletDrawEvents) {

                    this.wpsMapServiceInstance = wpsMapService;

                    var drawnItems = new L.FeatureGroup();

                    angular.extend($scope, {
                        center: {
                            lat: 51.95,
                            lng: 7.63,
                            zoom: 13
                        },
                        layers: {
                            baselayers: {
                                osm: {
                                    name: 'OpenStreetMap',
                                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                                    type: 'xyz'
                                }
                            },
                            overlays: {
                            }
                        },
                        controls: {
                        }
                    });

                    // called, when the map has loaded:
                    leafletData.getMap().then(function (map) {
                        
                        // add drawLayers to map:
                        drawnItems = new L.featureGroup().addTo(map);

                        // called, when a single geojson feature is created via leaflet.draw:
                        map.on('draw:created', function (e) {
                            var layer = e.layer;
                            drawnItems.addLayer(layer);
                            console.log(JSON.stringify(drawnItems.toGeoJSON()));
                        });

                        // called, when the 'edit'-tool is enabled:
                        map.on('draw:editstart', function (e) {
                            // testing the addInputLayer $scope function:
                            var jsonxmpl = {"type": "FeatureCollection", "features": [{"type": "Feature", "properties": {}, "geometry": {"type": "Polygon", "coordinates": [[[7.621936798095703, 51.93749209045435], [7.621936798095703, 51.95622058741223], [7.6621055603027335, 51.95622058741223], [7.6621055603027335, 51.93749209045435], [7.621936798095703, 51.93749209045435]]]}}]};
                            $scope.addInputLayer(jsonxmpl);
                        });

                        // add drawItems-layer to mapcontrols and enable 'edit'-feature on it:
                        map.addControl(new L.Control.Draw({
                            position: "bottomright",
                            edit: {featureGroup: drawnItems}
                        }));
                    });

                    /**
                     * enables/disables the Leaflet-Draw tools
                     * @param {type} enabled - true to enable the draw controls/ false to disable the draw controls
                     * @returns {undefined}
                     */
                    $scope.setDrawEnabled = function (enabled) {
                        if (enabled) {
                            
                        } else {
                            
                        }
                    };

                    /**
                     * adds a geojson featurecollection as a layer onto the leaflet map
                     * @param {type} geojson
                     * @returns {undefined}
                     */
                    $scope.addInputLayer = function (geojson) {
                        $scope.layers.overlays = {
                            blub: {
                                name: "Input",
                                type: "geoJSONShape",
                                data: geojson,
                                style: {
                                    fillColor: "green",
                                    weight: 2,
                                    opacity: 1,
                                    color: 'white',
                                    dashArray: '3',
                                    fillOpacity: 0.7
                                },
                                layerOptions: {
                                    "showOnSelector": true,
                                    "layers": "BLUUUB"
                                }
                            }
                        };
                    };


                    // here include other methods for map interaction 
                    // (like drawing or selecting geometries or enable/disable map editing)
                    // within those methods call the associated method from "wpsMapService"
                    
                    angular.extend($scope, {
                        geojson: {
                            data: this.wpsMapServiceInstance.geoJSONLayer,
                            style: {
                                fillColor: "red",
                                weight: 2,
                                opacity: 1,
                                color: 'white',
                                dashArray: '3',
                                fillOpacity: 0.7
                            }
                        }
                    });
                    
                    $scope.$on("addGeoJSONOutput", function(event, args) {
                    	
                    	console.log('Inside addGeoJSONOutput function!');
                    	
                        var geoJsonOutput = args.geoJSONFeature;

                        angular.extend($scope, {
                            geojson: {
                                data: geoJsonOutput,
                                style: {
                                    fillColor: "red",
                                    weight: 2,
                                    opacity: 1,
                                    color: 'white',
                                    dashArray: '3',
                                    fillOpacity: 0.7
                                }
                            }
                        });
                        
                        console.log('Should be added now!');
                        
                        console.log($scope.geojson);
                        
                        $scope.$apply();
                    })
                    
                }]
        });
