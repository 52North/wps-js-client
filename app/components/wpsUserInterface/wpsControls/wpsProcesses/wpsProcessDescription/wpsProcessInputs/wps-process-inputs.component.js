angular
		.module('wpsProcessInputs')
		.component(
				'wpsProcessInputs',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsProcesses/wpsProcessDescription/wpsProcessInputs/wps-process-inputs.template.html",

					controller : [
							'wpsPropertiesService',
							function WpsProcessInputsController(
									wpsPropertiesService) {
								/*
								 * references to wpsPropertiesService instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;

							} ]
				});