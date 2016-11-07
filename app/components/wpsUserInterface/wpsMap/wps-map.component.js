angular.module('wpsMap').component(
        'wpsMap',
        {
            templateUrl: "components/wpsUserInterface/wpsMap/wps-map.template.html",
            controller: ['$scope',
                '$timeout',
                'wpsMapService',
                'leafletData',
                function MapController($scope, $timeout, wpsMapService, leafletData) {

                    angular.extend($scope, {
                        center: {
                            lat: 51.95,
                            lng: 7.63,
                            zoom: 13
                        },
                        controls: {
                            draw: {}
                        }
                    });

                    leafletData.getMap().then(function (map) {
                        var drawnItems = new L.featureGroup().addTo(map);

                        map.on('draw:created', function (e) {
                            var layer = e.layer;
                            drawnItems.addLayer(layer);
                            console.log(JSON.stringify(layer.toGeoJSON()));
                        });

                    });

                    $scope.drawItems = {
                        polyline: false,
                        polygon: false,
                        circle: false,
                        rectangle: {
                            metric: false,
                            showArea: true,
                            shapeOptions: {
                                color: "#1A80C1"
                            }
                        },
                        marker: false
                    };

                    //this.wpsMapService = wpsMapService;



                    // here include other methods for map interaction 
                    // (like drawing or selecting geometries or enable/disable map editing)
                    // within those methods call the associated method from "wpsMapService"

                }]
        });