angular
		.module('wpsLiteralInputs')
		.component(
				'wpsLiteralInputs',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsProcesses/wpsProcessDescription/wpsProcessInputs/wpsLiteralInputs/wps-literal-inputs.template.html",

					controller : [
							'wpsPropertiesService', '$scope',
							function WpsLiteralInputsController(
									wpsPropertiesService, $scope) {
								/*
								 * references to wpsPropertiesService instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;
								
								$scope.hasLiteralData = function(input) {
									if(input.literalData)
										return true;
									
									return false;
								}


							} ]
				});