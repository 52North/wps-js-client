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
                function MapController($rootScope, $scope, $timeout, wpsMapService, wpsExecuteInputService, leafletData) {

                    var getBaseUrl = function () {
                        var url = window.location;
                        return url.origin;
                    }

                    this.reuseGeoJSONOutput = $rootScope.reuseGeoJSONOutput;
                    var LeafIcon = L.Icon.extend({
                        options: {
                            iconUrl: getBaseUrl + "/util/assets/marker-icon-red.png",
                            iconSize: [25, 41],
                            shadowSize: [41, 41],
                            iconAnchor: [12, 41],
                            shadowAnchor: [4, 41],
                            popupAnchor: [1, -34]
                        }
                    });
                    var defaultIcon = new LeafIcon({
                        iconUrl: '/util/assets/marker-icon-red.png'
                    });
                    var highlightIcon = new LeafIcon({
                        iconUrl: '/util/assets/marker-icon-blue.png'
                    });
                    this.defaultStyle = {
                        color: '#EF708A',
                        fillColor: '#EF708A',
                        weight: 4.0,
                        opacity: 0.7,
                        fillOpacity: 0.4
                    };
                    this.highlightStyle = {
                        color: '#3388ff',
                        fillColor: '#3388ff',
                        weight: 4.0,
                        opacity: 0.5,
                        fillOpacity: 0.2
                    };
                    this.wpsMapServiceInstance = wpsMapService;
                    $scope.wpsExecuteInputServiceInstance = wpsExecuteInputService;
                    $scope.inputLayerCounter = 0;

                    $scope.drawnItems = new L.FeatureGroup();
                    $scope.drawControl;

                    $scope.allDrawingToolsEnabled = false;

                    // add an input layer to the map:
                    $scope.$on('add-input-layer', function (event, args) {
                        console.log("add-input-layer has been called.");
                        var geojson = JSON.parse(args.geojson);
                        // TODO: error no json format feedback to user
                        $scope.addInputLayer(geojson, args.name, args.layerPropertyName);
                        // TODO: error json no geojson format feedback to user
                    });

                    // set leaflet plugins for complex data input enabled:
                    $scope.$on('set-complex-data-map-input-enabled', function (event, args) {
                        console.log("set-complex-data-map-input-enabled has been called.");
                        console.log(args);

                        // get params of broadcast:
                        $scope.allDrawingToolsEnabled = args.enabled;

                        if ($scope.allDrawingToolsEnabled) {
                            // enable
                            $scope.setDrawEnabled_complex(true);
                        } else {
                            // disable
                            $scope.setDrawEnabled_complex(false);
                        }
                    });

                    // set leaflet plugins for bbox data input enabled:
                    $scope.$on('set-bbox-data-map-input-enabled', function (event, args) {
                        console.log("set-bbox-data-map-input-enabled has been called.");
                        console.log(args);

                        // get params of broadcast:
                        $scope.allDrawingToolsEnabled = args.enabled;

                        if ($scope.allDrawingToolsEnabled) {
                            // enable
                            $scope.setDrawEnabled_bbox(true);
                        } else {
                            // disable
                            $scope.setDrawEnabled_bbox(false);
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

                    /**
                     * Resets the map, which includes:
                     *  - deletion of all overlays
                     */
                    var resetMap = function () {
                        deleteAllOverlays();
                    };

                    var deleteAllOverlays = function () {
                        console.log($scope.layers.overlays);
                        $scope.layers.overlays = {};
                    };

                    /**
                     * delete overlay for given input identifier
                     */
                    $scope.$on('delete-overlay-for-input', function (event, args) {
                        console.log("delete-overlay-for-input has been called.");

                        var inputIdentifier = args.inputIdentifier;

                        var inputLayerPropertyName = wpsMapService.generateUniqueInputLayerPropertyName(inputIdentifier);

                        delete $scope.layers.overlays[inputLayerPropertyName];

                        console.log($scope.layers.overlays);
                    });

                    /**
                     * remove all overlays from map
                     */
                    $scope.$on('reset-map-overlays', function (event, args) {
                        $scope.reusedLayerIDs = [];
                        console.log("reset-map-overlays has been called.");
                        resetMap();
                    });

                    /**
                     * clear all layers of leaflet-draw layer
                     */
                    $scope.$on('clear-draw-layers', function (event, args) {
                        $scope.reusedLayerIDs = [];
                        console.log("clear-draw-layers has been called.");
                        $scope.drawnItems.clearLayers();
                    });

                    /**
                     * delete a specific overlay for specific input identifier
                     */
                    $scope.$on('add-geometry-to-leaflet-draw-from-geojson-input', function (event, args) {
                        console.log("add-geometry-to-leaflet-draw-from-geojson-input has been called.");
                        console.log(args);
                        var geoJSON_asObject = args.geoJSON;

                        L.geoJson(geoJSON_asObject, {
                            onEachFeature: function (feature, layer) {
                                if (layer.getLayers) {
                                    layer.getLayers().forEach(function (currentLayer) {
                                        console.log(layer);
                                        console.log(feature);
                                        $scope.drawnItems.addLayer(currentLayer);
                                    })
                                } else {
                                    console.log(layer);
                                    console.log(feature);
                                    $scope.drawnItems.addLayer(layer);
                                }
                            },
                            style: this.defaultStyle
                        });
                        console.log($scope.drawnItems);
                    });

                    /**
                     * clear all layers of leaflet-draw layer
                     */
                    $scope.$on('clear-draw-layers', function (event, args) {
                        console.log("clear-draw-layers has been called.");

                        $scope.drawnItems.clearLayers();

                    });

                    var customResetMapControl = L.Control.extend({
                        options: {
                            position: 'topright'
                                    //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
                        },
                        onAdd: function (map) {
                            var container = L.DomUtil.create('input', 'leaflet-bar leaflet-control leaflet-control-custom');

                            container.type = 'button';
                            container.title = 'Reset Layers';
                            container.value = 'Reset Layers';
                            container.style.backgroundColor = 'white';
                            container.style.width = '90px';
                            container.style.height = '25px';

                            container.onmouseover = function () {
                                container.style.backgroundColor = '#F4F4F4';
                            }
                            container.onmouseout = function () {
                                container.style.backgroundColor = 'white';
                            }

                            container.onclick = function () {
                                resetMap();
                            }
                            return container;
                        },
                    });

                    // called, when the map has loaded:
                    leafletData.getMap().then(function (map) {
                        // create draw layers Control:
                        $scope.drawnItems = new L.featureGroup().addTo(map);
                        $scope.reusedLayers = new L.layerGroup();
                        $scope.reusedLayerIDs = [];
//                        $scope.drawControl = new L.Control.Draw({
//                            position: "bottomright",
//                            edit: {
//                                featureGroup: $scope.drawnItems
//                            }
//                        });
//
//                        // called, when a single geojson feature is created via leaflet.draw:
//                        map.on('draw:created', function (e) {
//                            var layer = e.layer;
//                            $scope.drawnItems.addLayer(layer);
//                            console.log(JSON.stringify($scope.drawnItems.toGeoJSON()));
//                        });


                        // add resetMap button
                        map.addControl(new customResetMapControl());

//                        // add drawItems-layer to mapcontrols and enable 'edit'-feature on it:
//                        map.addControl(new L.Control.Draw({
//                            position: "bottomright",
//                            edit: {featureGroup: drawnItems}
//                        }));

                        // drawControl.addTo(map);

                        // add drawControls to map:
//                        $scope.setDrawEnabled_complex(false);

                        console.log(map);

                    });

                    $scope.drawctrlEnabled = true;

                    /**
                     * decides wether a layer is a circle or not.
                     * @param {type} layer
                     * @returns {boolean}
                     */
                    var isCircle = function (layer) {
                        if (layer._mRadius)
                            return true;
                        return false;
                    };

                    var d2r = Math.PI / 180; // degrees to radians
                    var r2d = 180 / Math.PI; // radians to degrees
                    var earthsradius = 3963; // 3963 is the radius of the earth in miles

                    /**
                     * creates a CirclePolygone Geojsonfeature with nPoints number of points.
                     * @param {type} layer - drawlayer
                     * @param {type} nPoints - number of points for the polygone
                     * @returns {undefined}
                     */
                    var getCirclePolygone = function (layer) {

                        var polyCircle = {
                            type: "FeatureCollection",
                            features: [{
                                    type: "Feature",
                                    properties: {},
                                    geometry: {
                                        type: "Polygon",
                                        coordinates: [
                                            [
                                            ]
                                        ]
                                    }
                                }]
                        };
                        var radius = layer._mRadius / 1609.344; // meters -> miles
                        var lat = layer._latlng.lat;
                        var lng = layer._latlng.lng;

                        // find the radius in lat/lon
                        var rlat = (radius / earthsradius) * r2d;
                        var rlng = rlat / Math.cos(lat * d2r);

                        var nPoints = 32;

                        for (var i = 0; i < nPoints + 1; i++) // one extra here makes sure we connect the
                        {
                            var theta = Math.PI * (i / (nPoints / 2));
                            var ex = lng + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
                            var ey = lat + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
                            polyCircle.features[0].geometry.coordinates[0].push(
                                    [ex, ey]
                                    );
                        }
                        return polyCircle;
                    }
                    ;

                    /**
                     * enables/disables the Leaflet-Draw tools
                     * @param {type} enabled - true to enable the draw controls/ false to disable the draw controls
                     * @returns {undefined}
                     */
                    $scope.setDrawEnabled_complex = function (enabled) {

                        leafletData.getMap().then(function (map) {

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
                                    if (isCircle(e.layer)) {
                                        var circlePoly = getCirclePolygone(layer);
                                        // create circlePoly layer and add it to drawnItems:
                                        var geoJSON_asObject = circlePoly;

                                        L.geoJson(geoJSON_asObject, {
                                            onEachFeature: function (feature, layer) {
                                                console.log(layer);
                                                if (layer.getLayers) {
                                                    layer.getLayers().forEach(function (currentLayer) {
                                                        $scope.drawnItems.addLayer(currentLayer);
                                                        console.log("added");
                                                    });
                                                } else {
                                                    $scope.drawnItems.addLayer(layer);
                                                    console.log("added");
                                                }
                                            },
                                            style: {
                                                color: '#3388ff',
                                                fillColor: '#3388ff',
                                                weight: 4.0,
                                                opacity: 0.5,
                                                fillOpacity: 0.2
                                            }
                                        });
                                    } else {
                                        $scope.drawnItems.addLayer(layer);
                                        if (layer._icon !== undefined) {
                                            layer._icon.src = window.location.origin + "/util/assets/marker-icon-blue.png";
                                        }
                                        console.log("added");
                                    }
                                    wpsExecuteInputService.complexPayload = JSON.stringify($scope.drawnItems.toGeoJSON());
                                    // update geojson-selection in service:
                                    console.log(JSON.stringify($scope.drawnItems.toGeoJSON()));
                                    console.log(layer);
                                });

                                // called, when a single geojson feature is created via leaflet.draw:
                                map.on('draw:edited', function (e) {
                                    var layer = e.layer;
                                    //  $scope.drawnItems.addLayer(layer);
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

                                try {
                                    map.removeControl($scope.drawControl);
                                } catch (e) {
                                    console.log(e);
                                }

                            }
                        });
                    };

                    /**
                     * enables/disables the Leaflet-Draw tools for BoundingBoxInputs
                     * @param {type} enabled - true to enable the draw controls/ false to disable the draw controls
                     * @returns {undefined}
                     */
                    $scope.setDrawEnabled_bbox = function (enabled) {

                        leafletData.getMap().then(function (map) {

                            console.log(map);

                            if (enabled) {

                                $scope.drawControl = new L.Control.Draw({
                                    position: "bottomright",
                                    draw: {
                                        polygon: false,
                                        marker: false,
                                        circle: false,
                                        polyline: false
                                    },
                                    edit: {
                                        featureGroup: $scope.drawnItems
                                    }
                                });

                                // called, when a single geojson feature is created via leaflet.draw:
                                map.on('draw:created', function (e) {
                                    var layer = e.layer;
                                    $scope.drawnItems.addLayer(layer);

                                    var geoJson_bbox = $scope.drawnItems.toGeoJSON();

                                    console.log(JSON.stringify(geoJson_bbox));
                                    // update geojson-selection in service:

                                    wpsExecuteInputService.bboxAsGeoJSON = geoJson_bbox;

                                    var corners = extractBboxCornersFromGeoJSON(geoJson_bbox);

                                    wpsExecuteInputService.bboxLowerCorner = corners.lowerCorner;
                                    wpsExecuteInputService.bboxUpperCorner = corners.upperCorner;
                                });

                                // called, when a single geojson feature is created via leaflet.draw:
                                map.on('draw:edited', function (e) {
                                    var layer = e.layer;
                                    var geoJson_bbox = $scope.drawnItems.toGeoJSON();

                                    console.log(JSON.stringify(geoJson_bbox));

                                    wpsExecuteInputService.bboxAsGeoJSON = geoJson_bbox;

                                    var corners = extractBboxCornersFromGeoJSON(geoJson_bbox);

                                    wpsExecuteInputService.bboxLowerCorner = corners.lowerCorner;
                                    wpsExecuteInputService.bboxUpperCorner = corners.upperCorner;
                                });

                                // called, when a single geojson feature is created via leaflet.draw:
                                map.on('draw:deleted', function (e) {
                                    var layer = e.layer;
                                    var geoJson_bbox = $scope.drawnItems.toGeoJSON();

                                    console.log(JSON.stringify(geoJson_bbox));

                                    wpsExecuteInputService.bboxAsGeoJSON = geoJson_bbox;

                                    var corners = extractBboxCornersFromGeoJSON(geoJson_bbox);

                                    wpsExecuteInputService.bboxLowerCorner = corners.lowerCorner;
                                    wpsExecuteInputService.bboxUpperCorner = corners.upperCorner;
                                });

                                // add drawItems-layer to mapcontrols and enable 'edit'-feature on it:
                                map.addControl($scope.drawControl);
                                $scope.allDrawingToolsEnabled = true;
                            } else {
                                console.log(map);

                                try {
                                    map.removeControl($scope.drawControl);
                                } catch (e) {
                                    console.log(e);
                                }

                            }
                        });

                    };

                    var extractBboxCornersFromGeoJSON = function (geoJson_bbox) {

                        var corners = {};

                        var lonMin;
                        var lonMax;
                        var latMin;
                        var latMax;

                        /*
                         * BBOX is encoded as GeoJSON FeatureCollection
                         * 
                         * hence geometry is available via object.features[0].geometry.coordinates[0]
                         */

                        var coordinatesArray = geoJson_bbox.features[0].geometry.coordinates;

                        /*
                         * coordinates array may look like: [[lon,lat],[lon,lat]]
                         */
                        var points = coordinatesArray[0];

                        /*
                         * initialize variables with first point
                         */
                        var firstPoint = points[0];
                        lonMax = firstPoint[0];
                        lonMin = firstPoint[0];
                        latMax = firstPoint[1];
                        latMin = firstPoint[1];

                        // remaining points
                        for (var index = 1; index < points.length; index++) {
                            var currentPoint = points[index];

                            var currentLat = currentPoint[1];
                            var currentLon = currentPoint[0];

                            if (currentLat > latMax)
                                latMax = currentLat;

                            else if (currentLat < latMin)
                                latMin = currentLat;

                            if (currentLon > lonMax)
                                lonMax = currentLon;

                            else if (currentLon < lonMin)
                                lonMin = currentLon;
                        }

                        var lowerLeftCornerString = latMin + " " + lonMin;
                        var upperRightCornerString = latMax + " " + lonMax;

                        corners.lowerCorner = lowerLeftCornerString;
                        corners.upperCorner = upperRightCornerString;

                        return corners;
                    };

                    /**
                     * adds a geojson featurecollection as a layer onto the leaflet map
                     * @param {type} geojson
                     * @returns {undefined}
                     */
                    $scope.addInputLayer = function (geojson, identifier, layerPropertyName) {

                        console.log(geojson);

                        if ($scope.layers.overlays[layerPropertyName]) {
                            delete $scope.layers.overlays[layerPropertyName];

                            console.log($scope.layers.overlays);
                        }

                        var geoJSONLayer = {
                            name: "Input: " + identifier,
                            type: "geoJSONShape",
                            data: geojson,
                            visible: true,
                            layerOptions: {
                                style: {
                                    color: '#1B4F72',
                                    fillColor: 'blue',
                                    weight: 2.0,
                                    opacity: 0.6,
                                    fillOpacity: 0.2
                                },
                                onEachFeature: onEachFeatureInputs
                            }
                        };

                        checkPopupContentProperty(geojson, identifier);

                        $scope.layers.overlays[layerPropertyName] = geoJSONLayer;

                        // refresh the layer!!! Otherwise display is not updated properly in case
                        // an existing overlay is updated! 
                        $scope.layers.overlays[layerPropertyName].doRefresh = true;
                        console.log("added input layer");
                    };

                    /*
                     * event/method to add a GeoJSON output to the map 
                     */
                    $scope.$on("addGeoJSONOutput", function (event, args) {
                        var geoJsonOutput = args.geoJSONFeature;
                        var layerPropertyName = args.layerPropertyName;
                        var outputIdentifier = args.outputIdentifier;
                        this.defaultStyle = {
                            color: '#EF708A',
                            fillColor: '#EF708A',
                            weight: 4.0,
                            opacity: 0.7,
                            fillOpacity: 0.4
                        };
                        this.highlightStyle = {
                            color: '#3388ff',
                            fillColor: '#3388ff',
                            weight: 4.0,
                            opacity: 0.5,
                            fillOpacity: 0.2
                        };

                        checkPopupContentProperty(geoJsonOutput, outputIdentifier);

                        var outputIcon = L.icon({
                            iconUrl: window.location.origin + "/util/assets/marker-icon-red.png",
                            iconSize: [25, 41],
                            shadowSize: [41, 41],
                            iconAnchor: [12, 41],
                            shadowAnchor: [4, 41],
                            popupAnchor: [1, -34]
                        });

                        var geoJSONLayer = {
                            name: 'Output: ' + outputIdentifier,
                            type: 'geoJSONShape',
                            data: geoJsonOutput,
                            visible: true,
                            layerOptions: {
                                style: defaultStyle,
                                pointToLayer: function (feature, latlng) {
                                    return new L.Marker(latlng, {icon: outputIcon});
                                },
                                onEachFeature: onEachFeatureOutputs($rootScope.reuseGeoJSONOutput, defaultStyle, highlightStyle)
                            }
                        };

                        console.log(args);
                        $scope.layers.overlays[layerPropertyName] = geoJSONLayer;

                        // center map to new output
                        $scope.centerGeoJSONOutput(layerPropertyName);
                        console.log("added output layer");
                        console.log(geoJSONLayer);

                    });

//                    var addWMSOutput = function() {
//                    	
//                        var url = 'http://demo.opengeo.org/geoserver/ows?';
//                        var layerPropertyName = 'testWMS';
//                        var outputIdentifier = 'testWMS';
//                        
//                        var wmsLayer = {
//                                name: 'Output: ' + outputIdentifier,
//                                type: 'wms',
//                                visible: true,
//                                url: url,
//                                layerParams: {
//                                	layers: 'ne:ne',
//                                	format: 'image/png',
//                                    transparent: true
//                                }
//                            };
//                        
//                        $scope.layers.overlays[layerPropertyName] = wmsLayer;
//                        
//                        console.log("Test WMS");
//                        
//                    };

                    /*
                     * event/method to add a WMS output to the map 
                     */
                    $scope.$on("addWMSOutput", function (event, args) {

                        var wmsURL = args.wmsURL;
                        var layerPropertyName = args.layerPropertyName;
                        var outputIdentifier = args.outputIdentifier;
                        var layerNamesString = args.layerNamesString;
//                        var testLayerNames = layerNamesString + ",topp:tasmania_state_boundaries";
//                        console.log(testLayerNames);

                        var wmsLayer = {
                            name: 'Output: ' + outputIdentifier,
                            type: 'wms',
                            visible: true,
                            url: wmsURL,
                            layerParams: {
                                layers: layerNamesString,
                                format: 'image/png',
                                transparent: true
                            }
                        };

                        $scope.layers.overlays[layerPropertyName] = wmsLayer;
                    });

                    var checkPopupContentProperty = function (geoJson, identifier) {
                        /*
                         * check if geoJsonOutput has a .property.popupContent attribute
                         * (important for click interaction with displayed output,
                         * as it will be displayed in a popup)
                         * 
                         * if not, then set it with the identifier
                         */
                        if (geoJson.properties) {
                            if (geoJson.properties.popupContent) {
                                /*
                                 * here we have to do nothing, as the desired property is already set
                                 */
                            } else
                                geoJson.properties.popupContent = identifier;
                        } else {
                            geoJson.properties = {};
                            geoJson.properties.popupContent = identifier;
                        }

                        /*
                         * here we check the .properties.popupContent property for each feature of the output!
                         */
                        if (geoJson.features) {
                            var features = geoJson.features;

                            for (var i in features) {
                                var currentFeature = features[i];

                                if (currentFeature.properties) {
                                    if (currentFeature.properties.popupContent) {
                                        /*
                                         * here we have to do nothing, as the desired property is already set
                                         */
                                    } else
                                        currentFeature.properties.popupContent = identifier;
                                } else {
                                    currentFeature.properties = {};
                                    currentFeature.properties.popupContent = identifier;
                                }

                                features[i] = currentFeature;
                            }
                        }
                    };

                    /**
                     * Centers the map according to the given overlay
                     * 
                     */
                    $scope.centerGeoJSONOutput = function (layerPropertyName) {

                        var latlngs = [];

                        /*
                         * TODO how to detect the array depth of coordinates???
                         * 
                         * FIXME how to detect the array depth of coordinates???
                         * 
                         * maybe use geoJSON type property to gues the array depth 
                         * (e.g. multiPolygon has different depth than simple Polygon)
                         */

                        var coordinates;

                        if ($scope.layers.overlays[layerPropertyName].data.geometry) {
                            coordinates = $scope.layers.overlays[layerPropertyName].data.geometry.coordinates;

                            for (var i in coordinates) {
                                var points = coordinates[i];
                                for (var k in points) {
                                    latlngs.push(L.GeoJSON.coordsToLatLng(points[k]));
                                }
                            }
                        } else if ($scope.layers.overlays[layerPropertyName].data.features) {
                            coordinates = $scope.layers.overlays[layerPropertyName].data.features[0].geometry.coordinates;

                            for (var i in coordinates) {
                                var coord = coordinates[i];
                                for (var j in coord) {
                                    var points = coord[j];
                                    for (var k in points) {
                                        latlngs.push(L.GeoJSON.coordsToLatLng(points[k]));
                                    }
                                }
                            }
                        } else
                            return;

                        leafletData.getMap().then(function (map) {
                            map.fitBounds(latlngs);
                        });
                    };

                    /**
                     * binds the popup of a clicked output 
                     * to layer.feature.properties.popupContent
                     */
                    function onEachFeatureOutputs(reuseGeoJson, defaultStyle, highlightStyle) {

                        var getBaseUrl = function () {
                            var url = window.location;
                            return url.origin;
                        };

                        return function onEachFeature(feature, layer) {
                            // does this feature have a property named popupContent?
                            layer.on({
                                mouseover: function () {
                                    var popupContent = layer.feature.properties.popupContent;
                                    if (popupContent)
                                        layer.bindPopup(popupContent);
                                },
                                click: function () {
                                    var layerId = layer._leaflet_id - 1;
                                    console.log($scope.allDrawingToolsEnabled);
                                    if ($scope.wpsExecuteInputServiceInstance.selectedExecuteInput !== undefined &&
                                            $scope.wpsExecuteInputServiceInstance.selectedExecuteInput.complexData &&
                                            $scope.allDrawingToolsEnabled) {
//                                            $scope.wpsExecuteInputServiceInstance.selectedExecuteInputFormat === 'application/vnd.geo+json') {
                                        if (layer.feature.geometry.type === "Point") { // handle point features:
                                            if (layer._map._layers[layerId].setSelected === "undefined" || layer._map._layers[layerId].setSelected === "false") {
                                                layer._map._layers[layerId].setSelected = "true";
                                                if (reuseGeoJson) {
                                                    layer._icon.src = getBaseUrl() + "/util/assets/marker-icon-red.png";
                                                    var removeIndex = $scope.reusedLayerIDs.indexOf(layerId);
                                                    if (removeIndex > -1) {
                                                        $scope.reusedLayerIDs.splice(removeIndex, 1);
                                                    }
                                                }
                                            } else {
                                                layer._map._layers[layerId].setSelected = "false";
                                                if (reuseGeoJson) {
                                                    layer._icon.src = getBaseUrl() + "/util/assets/marker-icon-blue.png";
                                                    $scope.reusedLayerIDs.push(layerId);
                                                    layer._map._layers[layerId].options.style = highlightStyle;
                                                }
                                            }
                                        } else {
                                            if (layer._layers[layerId].setSelected === "undefined" || layer._layers[layerId].setSelected === "false") {
                                                layer._layers[layerId].setSelected = "true";
                                                if (reuseGeoJson) {
                                                    layer.setStyle(defaultStyle);
                                                    layer._layers[layerId].options.style = defaultStyle;
                                                    var removeIndex = $scope.reusedLayerIDs.indexOf(layerId);
                                                    if (removeIndex > -1) {
                                                        $scope.reusedLayerIDs.splice(removeIndex, 1);
                                                    }
                                                }
                                            } else {
                                                layer._layers[layerId].setSelected = "false";
                                                if (reuseGeoJson) {
                                                    layer.setStyle(highlightStyle);
                                                    $scope.reusedLayerIDs.push(layerId);
                                                    layer._layers[layerId].options.style = highlightStyle;
                                                }
                                            }
                                        }
                                        console.log(layer);
                                        $scope.reusedLayers = new L.featureGroup();
                                        for (var i = 0; i < $scope.reusedLayerIDs.length; i++) {
                                            var layerID = $scope.reusedLayerIDs[i];
                                            $scope.reusedLayers.addLayer($scope.drawnItems._map._layers[layerID]);
                                        }
                                        wpsExecuteInputService.complexPayload = JSON.stringify($scope.reusedLayers.toGeoJSON());
                                    }

                                }
                            })
                        }
                    }
                    ;

                    function onEachFeatureInputs(feature, layer) {
                        // does this feature have a property named popupContent?
                        layer.on({
                            click: function () {
                                var popupContent = layer.feature.properties.popupContent;
                                if (popupContent)
                                    layer.bindPopup(popupContent);
                            }
                        })
                    }

                }
            ]
        });