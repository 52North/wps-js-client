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
                        
                        // add resetMap button
                        map.addControl(new customResetMapControl());

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
                    
//                    angular.extend($scope, {
//                        geojson: {
//                            data: this.wpsMapServiceInstance.geoJSONLayer,
//                            style: {
//                                fillColor: "red",
//                                weight: 2,
//                                opacity: 1,
//                                color: 'white',
//                                dashArray: '3',
//                                fillOpacity: 0.7
//                            }
//                        }
//                    });
                    
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
