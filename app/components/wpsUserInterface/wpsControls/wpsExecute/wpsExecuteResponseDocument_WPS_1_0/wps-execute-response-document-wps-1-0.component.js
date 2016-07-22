angular
		.module('wpsExecuteResponseDocumentWps1')
		.component(
				'wpsExecuteResponseDocumentWps1',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsExecute/wpsExecuteResponseDocument_WPS_1_0/wps-execute-response-document-wps-1-0.template.html",

					controller : [
							'wpsPropertiesService',
							function WpsExecuteResponseDocumentWps1Controller(
									wpsPropertiesService) {
								/*
								 * reference to wpsPropertiesService instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;

							} ]
				});