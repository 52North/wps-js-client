angular
		.module('wpsLiteralInputs')
		.component(
				'wpsLiteralInputs',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsProcesses/wpsProcessDescription/wpsProcessInputs/wpsLiteralInputs/wps-literal-inputs.template.html",

					controller : [
							'wpsPropertiesService', 'wpsInputFilterService',
							function WpsLiteralInputsController(
									wpsPropertiesService, wpsInputFilterService) {
								/*
								 * references to wpsPropertiesService instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;
								
								this.wpsInputFilterServiceInstance = wpsInputFilterService;


							} ]
				});