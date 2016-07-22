angular
		.module('wpsExecuteStatusInfoDocumentWps2')
		.component(
				'wpsExecuteStatusInfoDocumentWps2',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsExecute/wpsExecuteStatusInfoDocument_WPS_2_0/wps-execute-status-info-document-wps-2-0.template.html",

					controller : [
							'wpsPropertiesService',
							function WpsExecuteStatusInfoDocumentWps2Controller(
									wpsPropertiesService) {
								/*
								 * reference to wpsPropertiesService instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;
								
								this.performGetStatus = function(){
									/*
									 * TODO
									 */
								};

							} ]
				});