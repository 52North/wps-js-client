angular
		.module('wpsExecuteResultDocumentWps2')
		.component(
				'wpsExecuteResultDocumentWps2',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsExecute/wpsExecuteResultDocument_WPS_2_0/wps-execute-result-document-wps-2-0.template.html",

					controller : [
							'wpsPropertiesService', 'wpsFormControlService',
							function WpsExecuteResultDocumentWps2Controller(
									wpsPropertiesService, wpsFormControlService) {
								/*
								 * reference to wpsPropertiesService instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;
								
								this.wpsFormControlServiceInstance = wpsFormControlService;

							} ]
				});