angular
		.module('wpsExecuteResponseDocumentWps1')
		.component(
				'wpsExecuteResponseDocumentWps1',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsExecute/wpsExecuteResponseDocument_WPS_1_0/wps-execute-response-document-wps-1-0.template.html",

					controller : [
							'wpsPropertiesService', '$scope',
							function WpsExecuteResponseDocumentWps1Controller(
									wpsPropertiesService, $scope) {
								/*
								 * reference to wpsPropertiesService instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;
								
								this.refreshStatus = function() {
									/*
									 * TODO get statusLocation value from current response 
									 * document and trigger !
									 */
									var documentLocation = this.wpsPropertiesServiceInstance.responseDocument_wps_1_0.statusLocation;

									this.wpsPropertiesServiceInstance
											.fetchUpdatedResponseDocument_wps_1_0(
													this.onRefreshedResponseDocument, documentLocation);
								};

								this.onRefreshedResponseDocument = function(
										wpsResponse) {
									/*
									 * check response for reasonable content
									 */
									if (wpsResponse.executeResponse)
										wpsPropertiesService
												.onExecuteResponseChange(wpsResponse.executeResponse);

									/**
									 * TODO error/success messages?
									 */
									
									$scope.$apply();
								};

							} ]
				});