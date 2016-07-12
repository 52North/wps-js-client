angular
		.module('wpsBoundingBoxInputs')
		.component(
				'wpsBoundingBoxInputs',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsProcesses/wpsProcessDescription/wpsProcessInputs/wpsBoundingBoxInputs/wps-bounding-box-inputs.template.html",

					controller : [
							'wpsPropertiesService', 'wpsInputFilterService',
							function WpsBoundingBoxInputsController(
									wpsPropertiesService, wpsInputFilterService) {
								/*
								 * reference to wpsPropertiesService instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;
								
								this.wpsInputFilterServiceInstance = wpsInputFilterService;


							} ]
				});