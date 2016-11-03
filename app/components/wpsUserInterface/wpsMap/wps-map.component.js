angular.module('wpsMap').component(
		'wpsMap',
		{
			templateUrl : "components/wpsUserInterface/wpsMap/wps-map.template.html",
			controller : ['wpsMapService', function MapController(wpsMapService) {

				this.wpsMapService = wpsMapService;
				
				this.initializeMap = function(){
					this.wpsMapService.initializeMap();
				};
        
        // here include other methods for map interaction 
        // (like drawing or selecting geometries or enable/disable map editing)
        // within those methods call the associated method from "wpsMapService"

			}]
		});