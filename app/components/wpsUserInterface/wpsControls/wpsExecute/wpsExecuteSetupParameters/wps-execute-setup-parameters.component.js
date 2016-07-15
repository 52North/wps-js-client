angular
		.module('wpsExecuteSetupParameters')
		.component(
				'wpsExecuteSetupParameters',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsExecute/wpsExecuteSetupParameters/wps-execute-setup-parameters.template.html",

					controller : [
							'wpsPropertiesService',
							function WpsExecuteSetupParametersController(
									wpsPropertiesService) {
								/*
								 * reference to wpsPropertiesService instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;

								this.responseFormats = [ 'document', 'raw' ];

							} ]
				});