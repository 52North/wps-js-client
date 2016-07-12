angular
		.module('wpsProcessInputs')
		.component(
				'wpsProcessInputs',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsProcesses/wpsProcessDescription/wpsProcessInputs/wps-process-inputs.template.html",

					controller : [
							'wpsPropertiesService', 'wpsInputFilterService',
							function WpsProcessInputsController(
									wpsPropertiesService, wpsInputFilterService) {
								/*
								 * references to wpsPropertiesService instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;
								
								this.wpsInputFilterServiceInstance = wpsInputFilterService;

							} ]
				});