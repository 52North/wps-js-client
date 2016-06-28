angular.module('wpsControls').component(
		'wpsControls',
		{
			templateUrl : "components/wpsControls/wps-controls.template.html",
			/*
			 * controller is injected with two module-values from module
			 * wpsSetup
			 */
			controller : [ 'wpsFormControlService',
					function ControlsController(wpsFormControlService) {

						this.formControlServiceInstance = wpsFormControlService;

					} ]
		});