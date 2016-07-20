angular
		.module('wpsExecute')
		.component(
				'wpsExecute',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsExecute/wps-execute.template.html",
					/*
					 * injected with a modules service method that manages
					 * enabled tabs
					 */
					controller : [ 'wpsPropertiesService', function WpsExecuteController(wpsPropertiesService) {
						this.wpsPropertiesServiceInstance = wpsPropertiesService;
					} ]
				});