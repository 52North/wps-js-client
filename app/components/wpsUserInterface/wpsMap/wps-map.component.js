angular.module('wpsMap').component(
        'wpsMap',
        {
            templateUrl: "components/wpsUserInterface/wpsMap/wps-map.template.html",
            controller: [
                '$rootScope',
                '$scope',
                '$timeout',
                'wpsMapService',
                'wpsExecuteInputService',
                'leafletData',
                function MapController($rootScope, $scope, $timeout, wpsMapService, wpsExecuteInputService, leafletData, leafletDrawEvents) {

                    this.wpsMapService = wpsMapService;
                    this.wpsExecuteSetupInputs = wpsExecuteInputService;
                    $scope.inputLayerCounter = 0;

                    $scope.drawnItems = new L.FeatureGroup();
                    $scope.drawControl;

                    $scope.allDrawingToolsEnabled = false;

                    // add an input layer to the map:
                    $scope.$on('add-input-layer', function (event, args) {
                        console.log("add-input-layer has been called.");
                        var geojson = JSON.parse(args.geojson);
                        // TODO: error no json format feedback to user
                        $scope.addInputLayer(geojson, args.name);
                        // TODO: error json no geojson format feedback to user
                    });

                    // set leaflet plugins for complex data input enabled:
                    $scope.$on('set-complex-data-map-input-enabled', function (event, args) {
                        console.log("set-complex-data-map-input-enabled has been called.");
                        console.log(args);
                        // do something on this certain event, e.g.: add input layer:

                        // get params of broadcast:
                        $scope.allDrawingToolsEnabled = args.enabled;

                        if ($scope.allDrawingToolsEnabled) {
                            // enable
                            $scope.setDrawEnabled(true);
                        } else {
                            // disable
                            $scope.setDrawEnabled(false);
                        }
                    });



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
                        // create draw layers Control:
                        $scope.drawnItems = new L.featureGroup().addTo(map);
                        $scope.drawControl = new L.Control.Draw({
                            position: "bottomright",
                            edit: {
                                featureGroup: $scope.drawnItems
                            }
                        });

                        // called, when a single geojson feature is created via leaflet.draw:
                        map.on('draw:created', function (e) {
                            var layer = e.layer;
                            $scope.drawnItems.addLayer(layer);
                            console.log(JSON.stringify($scope.drawnItems.toGeoJSON()));
                        });

                        // called, when the 'edit'-tool is enabled:
                        map.on('draw:editstart', function (e) {
                            // testing the addInputLayer $scope function:
                            var jsonxmpl = {
                                "type": "FeatureCollection",
                                "features": [
                                    {
                                        "type": "Feature",
                                        "properties": {},
                                        "geometry": {
                                            "type": "Polygon",
                                            "coordinates": [
                                                [[7.621936798095703, 51.93749209045435],
                                                    [7.621936798095703, 51.95622058741223],
                                                    [7.6621055603027335, 51.95622058741223],
                                                    [7.6621055603027335, 51.93749209045435],
                                                    [7.621936798095703, 51.93749209045435]]
                                            ]
                                        }
                                    }
                                ]
                            };
                            //$scope.addInputLayer(jsonxmpl);
                        });

                        // drawControl.addTo(map);

                        // add drawControls to map:
                        $scope.setDrawEnabled(false);

                        console.log(map);
                    });

                    $scope.drawctrlEnabled = true;
                    /**
                     * enables/disables the Leaflet-Draw tools
                     * @param {type} enabled - true to enable the draw controls/ false to disable the draw controls
                     * @returns {undefined}
                     */
                    $scope.setDrawEnabled = function (enabled) {

                        leafletData.getMap().then(function (map) {
                            
                            console.log(map);

                            if (enabled) {
                                $scope.drawControl = new L.Control.Draw({
                                    position: "bottomright",
                                    edit: {
                                        featureGroup: $scope.drawnItems
                                    }
                                });

                                // called, when a single geojson feature is created via leaflet.draw:
                                map.on('draw:created', function (e) {
                                    var layer = e.layer;
                                    $scope.drawnItems.addLayer(layer);
                                    console.log(JSON.stringify($scope.drawnItems.toGeoJSON()));
                                    // update geojson-selection in service:
                                    wpsExecuteInputService.complexPayload = JSON.stringify($scope.drawnItems.toGeoJSON());
                                });

                                // called, when a single geojson feature is created via leaflet.draw:
                                map.on('draw:deleted', function (e) {
                                    var layer = e.layer;
                                    //drawnItems.addLayer(layer);
                                    console.log(JSON.stringify($scope.drawnItems.toGeoJSON()));
                                    // update geojson-selection in service:
                                    wpsExecuteInputService.complexPayload = JSON.stringify($scope.drawnItems.toGeoJSON());
                                });

                                // add drawItems-layer to mapcontrols and enable 'edit'-feature on it:
                                //drawControl.addTo(map);
                                map.addControl($scope.drawControl);
                                $scope.allDrawingToolsEnabled = true;
                            } else {
                                console.log(map);
                                map.removeControl($scope.drawControl);
                            }
                        });

                    };


                    /**
                     * adds a geojson featurecollection as a layer onto the leaflet map
                     * @param {type} geojson
                     * @returns {undefined}
                     */
                    $scope.addInputLayer = function (geojson, name) {
                        $scope.layers.overlays.blub = {};
                        console.log(geojson);
                        $scope.layers.overlays = {
                            blub: {
                                name: "Input: " + name + Math.random(100),
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

                }]
        });