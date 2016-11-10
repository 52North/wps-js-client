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

                    this.wpsMapService = wpsMapService;

                    var drawnItems = new L.FeatureGroup();
                    var drawControl;

                    $scope.a;
                    $scope.b;

                    console.log("calling testMapToService-function from MapController...");
                    this.wpsMapService.testMapToService(3);

                    $scope.$on('trigger-map-event-blub123', function (event, args) {
                        console.log("trigger-map-event-blub123 has been called.");
                        console.log(args);
                        // do something on this certain event, e.g.: add input layer:
                        
                        // get params of broadcast:
                        $scope.a = args.paramA;
                        $scope.b = args.paramB;
                        
                        // add a input layer:
                        var jsonxmpl = {"type": "FeatureCollection", "features": [{"type": "Feature", "properties": {}, "geometry": {"type": "Polygon", "coordinates": [[[7.621936798095703, 51.93749209045435], [7.621936798095703, 51.95622058741223], [7.6621055603027335, 51.95622058741223], [7.6621055603027335, 51.93749209045435], [7.621936798095703, 51.93749209045435]]]}}]};
                        $scope.addInputLayer(jsonxmpl);
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
                        drawnItems = new L.featureGroup().addTo(map);
                        drawControl = new L.Control.Draw({
                            position: "bottomright",
                            edit: {
                                featureGroup: drawnItems
                            }
                        });

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

                        // drawControl.addTo(map);

                        // add drawControls to map:
                        $scope.setDrawEnabled(true);

                        // testing dynamic remove and add of draw controls:
                        $timeout(function () {
                            // remove drawControls from map:
                            $scope.setDrawEnabled(false);
                            $timeout(function () {
                                $scope.setDrawEnabled(true);
                            }, 2000);
                        }, 2000);
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

                            if (enabled) {
                                drawControl = new L.Control.Draw({
                                    position: "bottomright",
                                    edit: {
                                        featureGroup: drawnItems
                                    }
                                });


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
                                //drawControl.addTo(map);
                                map.addControl(drawControl);
                            } else {
                                console.log(map)
                                map.removeControl(drawControl);
                            }
                        });

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

                }]
        });