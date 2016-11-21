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

                    this.wpsMapServiceInstance = wpsMapService;
                    this.wpsExecuteSetupInputs = wpsExecuteInputService;
                    $scope.inputLayerCounter = 0;


                    $scope.drawnItems = new L.FeatureGroup();
                    $scope.drawControl;

                    $scope.allDrawingToolsEnabled = false;

                    // add an input layer to the map:
                    $scope.$on('add-input-layer', function (event, args) {
                        console.log("add-input-layer has been called.");
                        var geojson = JSON.parse(args.geojson);

                        $scope.addInputLayer(geojson, args.name);
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
                    
                    /**
					 * Resets the map, which includes:
					 *  - deletion of all overlays
					 */
					var resetMap = function(){
						deleteAllOverlays();
					};
					
					var deleteAllOverlays = function(){
						$scope.layers.overlays = {};
					};
                    
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
                    	    
                    	    container.onmouseover = function(){
                    	    	  container.style.backgroundColor = '#F4F4F4'; 
                    	    	}
                    	    	container.onmouseout = function(){
                    	    	  container.style.backgroundColor = 'white'; 
                    	    	}
                    	 
                    	    container.onclick = function(){
                    	      resetMap();
                    	    }
                    	    return container;
                      },
                     
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
                        
                        // add resetMap button
                        map.addControl(new customResetMapControl());

//                        // add drawItems-layer to mapcontrols and enable 'edit'-feature on it:
//                        map.addControl(new L.Control.Draw({
//                            position: "bottomright",
//                            edit: {featureGroup: drawnItems}
//                        }));

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
                    
                    /*
                     * event/method to add a GeoJSON output to the map 
                     */
                    $scope.$on("addGeoJSONOutput", function(event, args) {
                    	
                        var geoJsonOutput = args.geoJSONFeature;
                        var layerPropertyName = args.layerPropertyName;
                        var outputIdentifier = args.outputIdentifier;
                        
                        checkPopupContentProperty(geoJsonOutput, outputIdentifier);
                        
                        var geoJSONLayer = {
                                name: 'Output: ' + outputIdentifier,
                                type: 'geoJSONShape',
                                data: geoJsonOutput,
                                visible: true,
                                layerOptions: {
                                    style: {
                                            color: '#00D',
                                            fillColor: 'red',
                                            weight: 2.0,
                                            opacity: 0.6,
                                            fillOpacity: 0.2
                                    },
                                    onEachFeature: onEachFeature_output
                                }
                            };
                        
                        $scope.layers.overlays[layerPropertyName] = geoJSONLayer;
                        
                        // center map to new output
                        $scope.centerGeoJSONOutput(layerPropertyName);
                        
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
                    $scope.$on("addWMSOutput", function(event, args) {
                    	
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
                    
                    var checkPopupContentProperty = function(geoJsonOutput, outputIdentifier){
                    	/*
                         * check if geoJsonOutput has a .property.popupContent attribute
                         * (important for click interaction with displayed output,
                         * as it will be displayed in a popup)
                         * 
                         * if not, then set it with the identifier
                         */
                        if(geoJsonOutput.properties){
                        	if(geoJsonOutput.properties.popupContent){
                        		/*
                        		 * here we have to do nothing, as the desired property is already set
                        		 */
                        	}
                        	else
                        		geoJsonOutput.properties.popupContent = outputIdentifier;
                        }
                        else{
                        	geoJsonOutput.properties = {};
                        	geoJsonOutput.properties.popupContent = outputIdentifier;
                        }
                        
                        /*
                         * here we check the .properties.popupContent property for each feature of the output!
                         */
                        if(geoJsonOutput.features){
                        	var features = geoJsonOutput.features;
                        	
                        	for (var i in features){
                        		var currentFeature = features[i];
                        		
                        		if(currentFeature.properties){
                                	if(currentFeature.properties.popupContent){
                                		/*
                                		 * here we have to do nothing, as the desired property is already set
                                		 */
                                	}
                                	else
                                		currentFeature.properties.popupContent = outputIdentifier;
                                }
                                else{
                                	currentFeature.properties = {};
                                	currentFeature.properties.popupContent = outputIdentifier;
                                }
                        		
                        		features[i] = currentFeature;
                        	}
                        }
                    };
                    
                    /**
                     * Centers the map according to the given overlay
                     * 
                     */
                    $scope.centerGeoJSONOutput = function(layerPropertyName) {
                    	
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
                        
                        if($scope.layers.overlays[layerPropertyName].data.geometry){
                        	coordinates = $scope.layers.overlays[layerPropertyName].data.geometry.coordinates;
                        	
                        	for (var i in coordinates) {
                                var points = coordinates[i];
                                for (var k in points) {
                                        latlngs.push(L.GeoJSON.coordsToLatLng(points[k]));
                                }
                            }
                        }
                        else if ($scope.layers.overlays[layerPropertyName].data.features){
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
                        }
                        	
                        else
                        	return;

                        leafletData.getMap().then(function(map) {
                            map.fitBounds(latlngs);
                        });
                    };
                    
                    /**
                     * binds the popup of a clicked output 
                     * to layer.feature.properties.popupContent
                     */
                    function onEachFeature_output(feature, layer) {
					    // does this feature have a property named popupContent?
                    	layer.on({
                            click: function() {	
                            	
                              var popupContent = layer.feature.properties.popupContent;
                              
                              if(popupContent)
                            	  layer.bindPopup(popupContent);
                            }
                          })
					};
                    
                }]
        });
