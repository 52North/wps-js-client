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
								this.wpsPropertiesServiceInstance.selectedServiceUrl = '';
								
								this.wpsFormControlServiceInstance = wpsFormControlService;
								
								this.isRemoveButtonDisabled = true;

								this.changeVersion = function() {
									/*									
									 * reset capabilities divs
									 */
									wpsFormControlService.capabilitiesSuccess_classAttribute = 'hidden';
									wpsFormControlService.capabilitiesFailed_classAttribute = 'hidden';
									
									/*
									 * disable all tabs, will be enabled on capabilities response
									 */
									wpsPropertiesService.resetProcessDescription();
									wpsFormControlService.disableTabs();
									wpsFormControlService.resetTabContents();
									
									if (this.wpsPropertiesServiceInstance.selectedServiceUrl != '' && this.wpsPropertiesServiceInstance.selectedServiceUrl != undefined){
										wpsPropertiesService.initializeWpsLibrary();
										wpsPropertiesService.getCapabilities(this.capabilitiesCallback);
									}
								};
								
								this.changeWpsUrl = function(){
									/*									
									 * reset capabilities divs
									 */
									wpsFormControlService.capabilitiesSuccess_classAttribute = 'hidden';
									wpsFormControlService.capabilitiesFailed_classAttribute = 'hidden';
									
									/*
									 * disable all tabs, will be enabled on capabilities response
									 */
									wpsPropertiesService.resetProcessDescription();
									wpsFormControlService.disableTabs();
									wpsFormControlService.resetTabContents();
									
									wpsPropertiesService.initializeWpsLibrary();
									wpsPropertiesService.getCapabilities(this.capabilitiesCallback);
									
									this.isRemoveButtonDisabled = false;
									wpsFormControlService.removeWpsServiceButton_classAttribute = 'enabled';
								};
								
								this.removeSelectedWps = function(){
									wpsFormControlService.capabilitiesSuccess_classAttribute = 'hidden';
									wpsFormControlService.capabilitiesFailed_classAttribute = 'hidden';
									
									wpsPropertiesService.removeWpsServiceUrl();
									wpsFormControlService.disableTabs();
									
									this.isRemoveButtonDisabled = true;
									wpsFormControlService.removeWpsServiceButton_classAttribute = 'disabled';
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
										
										/*
										 * enable tabs vor wps version!
										 */
										wpsFormControlService.enableTabs();
										
										
									}
									else{
										/*
										 * disable all tabs, since there is no valid data
										 */
										wpsFormControlService.disableTabs();
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