angular
		.module('wpsSetup')
		.component(
				'wpsSetup',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsSetup/wps-setup.template.html",
					/*
					 * injected with a modules service method that manages
					 * enabled tabs
					 */
					controller : [
							'wpsPropertiesService', 'wpsFormControlService', '$scope',
							function WpsSetupController(wpsPropertiesService, wpsFormControlService, $scope) {
								/*
								 * references to wpsPropertiesService and wpsFormControl instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;
								
								this.wpsFormControlServiceInstance = wpsFormControlService;

								this.changeVersion = function() {
									/*									
									 * reset capabilities divs
									 */
									wpsFormControlService.capabilitiesSuccess_classAttribute = 'hidden';
									wpsFormControlService.capabilitiesFailed_classAttribute = 'hidden';
									
									wpsPropertiesService.initializeWpsLibrary();
									wpsFormControlService.onWpsVersionChanged();
									wpsPropertiesService.getCapabilities(this.capabilitiesCallback);
								};
								
								this.changeWpsUrl = function(){
									/*									
									 * reset capabilities divs
									 */
									wpsFormControlService.capabilitiesSuccess_classAttribute = 'hidden';
									wpsFormControlService.capabilitiesFailed_classAttribute = 'hidden';
									
									wpsFormControlService.onWpsUrlChanged();
									wpsPropertiesService.initializeWpsLibrary();
									wpsPropertiesService.getCapabilities(this.capabilitiesCallback);
								};
								
								this.removeSelectedWps = function(){
									wpsPropertiesService.removeWpsServiceUrl();
									wpsFormControlService.onWpsUrlChanged();
								};
								
								this.capabilitiesCallback = function(capabilitiesResponse){
									
									/*
									 * check received capObject for reasonable structure.
									 */
									if(capabilitiesResponse.capabilities){
										/*
										 * re-call wpsPropertiesService to actually modify it's capabilities object
										 */
										var capObject = capabilitiesResponse.capabilities;
										wpsPropertiesService.onCapabilitiesChange(capObject);
										
										wpsFormControlService.capabilitiesSuccess_classAttribute = '';
									}
									else{
										/*
										 * error occurred!
										 * enable error message
										 */
										wpsFormControlService.capabilitiesFailed_errorThrown = capabilitiesResponse.errorThrown;
										wpsFormControlService.capabilitiesFailed_classAttribute = '';
									}
									
									/*
									 * call $apply manually to modify service references
									 */
									$scope.$apply();
								}
							} ]
				});