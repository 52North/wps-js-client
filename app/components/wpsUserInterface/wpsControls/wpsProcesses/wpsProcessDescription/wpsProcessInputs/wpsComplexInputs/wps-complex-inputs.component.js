angular
		.module('wpsComplexInputs')
		.component(
				'wpsComplexInputs',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsProcesses/wpsProcessDescription/wpsProcessInputs/wpsComplexInputs/wps-complex-inputs.template.html",

					controller : [
							'wpsPropertiesService', 'wpsInputFilterService',
							function WpsComplexInputsController(
									wpsPropertiesService, wpsInputFilterService) {
								/*
								 * reference to wpsPropertiesService instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;
								
								this.wpsInputFilterServiceInstance = wpsInputFilterService;


							} ]
				});