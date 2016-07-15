angular
		.module('wpsExecute')
		.component(
				'wpsExecute',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsExecute/wps-execute.template.html",
					/*
					 * injected with a modules service method that manages
					 * enabled tabs
					 */
					controller : [
							'wpsPropertiesService', 'wpsFormControlService', '$scope', 
							function WpsExecuteController(wpsPropertiesService, wpsFormControlService, $scope) {
								/*
								 * references to wpsPropertiesService and wpsFormControl instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;
								
								this.wpsFormControlServiceInstance = wpsFormControlService;
								
								/*
								 * TODO method for execution of execute request
								 */
								
								this.performExecuteRequest = function() {
									
									this.wpsPropertiesServiceInstance.execute(this.executeCallback);
									
									this.wpsFormControlServiceInstance.resetTabContents();
								};
								
								this.executeCallback = function(executeResponseObj){
									
									/*
									 * check received capObject for reasonable structure.
									 */
									if(executeResponseObj.executeResponse){
										/*
										 * re-call wpsPropertiesService to actually modify it's capabilities object
										 */
										var executeResponse = executeResponseObj.executeResponse;
										wpsPropertiesService.onExecuteResponseChange(executeResponse);
										
										wpsFormControlService.executeSuccess_classAttribute = '';
										
										/*
										 * TODO enable GetStatus and GetResult Tabs
										 */
										
									}
									else{

										/*
										 * TODO block GetStatus and GetResult tabs
										 */
										
										/*
										 * error occurred!
										 * enable error message
										 */
										wpsFormControlService.executeFailed_errorThrown = executeResponseObj.errorThrown;
										wpsFormControlService.executeFailed_classAttribute = '';
									}
									
									/*
									 * call $apply manually to modify service references
									 */
									$scope.$apply();
								}
							} ]
				});