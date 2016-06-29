angular.module('wpsMap').component(
		'wpsMap',
		{
			templateUrl : "components/wpsUserInterface/wpsMap/wps-map.template.html",
			controller : ['wpsMapService', function MapController(wpsMapService) {

				this.wpsMapService = wpsMapService;
				
				this.initializeMap = function(){
					this.wpsMapService.initializeMap();
				};

			}]
		});