angular
		.module('wpsProcesses')
		.component(
				'wpsProcesses',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsProcesses/wps-processes.template.html",
					controller : ['wpsPropertiesService', 'wpsFormControlService', '$scope', function WpsProcessesController(
							wpsPropertiesService, wpsFormControlService, $scope) {

						this.wpsPropertiesServiceInstance = wpsPropertiesService;
						this.wpsFormControlServiceInstance = wpsFormControlService;
						
						
						this.changeWpsProcess = function(){
							/*									
							 * reset capabilities divs
							 */
							wpsFormControlService.describeProcessSuccess_classAttribute = 'hidden';
							wpsFormControlService.describeProcessFailed_classAttribute = 'hidden';
							
							wpsFormControlService.resetTabContents();
							
							if(this.wpsPropertiesServiceInstance.selectedProcess)							
								wpsPropertiesService.describeProcess(this.describeProcessCallback);
						}
						
						this.describeProcessCallback = function(describeProcessResponse){
							/*
							 * TODO block execute once a process description could not be retrieved?
							 */
							
							
							/*
							 * check received object for reasonable structure.
							 */
							if(describeProcessResponse.processOffering){
								/*
								 * re-call wpsPropertiesService to actually modify it's processDescription object
								 */
								var processDescrObject = describeProcessResponse.processOffering;
								wpsPropertiesService.onProcessDescriptionChange(processDescrObject);
								
								wpsFormControlService.describeProcessSuccess_classAttribute = '';
								
								
								//wpsFormControlService.enableTabs();
								
								
							}
							else{

								// wpsFormControlService.disableTabs();
								/*
								 * error occurred!
								 * enable error message
								 */
								wpsFormControlService.describeProcessFailed_errorThrown = describeProcessResponse.errorThrown;
								wpsFormControlService.describeProcessFailed_classAttribute = '';
							}
							
							/*
							 * call $apply manually to modify service references
							 */
							$scope.$apply();
						}
						
					}]
				});