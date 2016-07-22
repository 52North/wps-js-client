angular
		.module('wpsExecuteResponseDocumentWps1')
		.component(
				'wpsExecuteResponseDocumentWps1',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsExecute/wpsExecuteResponseDocument_WPS_1_0/wps-execute-response-document-wps-1-0.template.html",

					controller : [
							'wpsPropertiesService', 'wpsFormControlService',
							function WpsExecuteResponseDocumentWps1Controller(
									wpsPropertiesService, wpsFormControlService) {
								/*
								 * reference to wpsPropertiesService instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;
								
								this.wpsFormControlServiceInstance = wpsFormControlService;

							} ]
				});