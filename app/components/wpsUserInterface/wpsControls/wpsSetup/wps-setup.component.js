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
									wpsPropertiesService.onServiceVersionChanged();
									wpsFormControlService.onWpsVersionChanged();
									wpsPropertiesService.getCapabilities(this.capabilitiesCallback);
								};
								
								this.changeWpsUrl = function(){
									wpsFormControlService.onWpsUrlChanged();
									wpsPropertiesService.onServiceUrlChanged();
									wpsPropertiesService.getCapabilities(this.capabilitiesCallback);
								};
								
								this.removeSelectedWps = function(){
									wpsPropertiesService.removeWpsServiceUrl();
									wpsFormControlService.onWpsUrlChanged();
								};
								
								this.capabilitiesCallback = function(capabilitiesResponse){
									var capObject = capabilitiesResponse.capabilities;
									/*
									 * re-call wpsPropertiesService to actually modify it's capabilities object
									 */
									wpsPropertiesService.onCapabilitiesChange(capObject);
									
									/*
									 * call $apply manually to modify service references
									 */
									$scope.$apply();
								}
							} ]
				});