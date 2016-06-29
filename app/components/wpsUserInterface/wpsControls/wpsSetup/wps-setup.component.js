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
							'wpsPropertiesService', 'wpsFormControlService',
							function WpsSetupController(wpsPropertiesService, wpsFormControlService) {
								/*
								 * references to wpsPropertiesService and wpsFormControl instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;
								
								this.wpsFormControlServiceInstance = wpsFormControlService;

								this.changeVersion = function() {
									wpsFormControlService.onWpsVersionChanged();
									wpsPropertiesService.onServiceVersionChanged();
									wpsPropertiesService.getCapabilities(this.capabilitiesCallback);
								};
								
								this.changeWpsUrl = function(){
									wpsFormControlService.onWpsUrlChanged();
									wpsPropertiesService.onServiceUrlChanged();
									wpsPropertiesService.getCapabilities(this.capabilitiesCallback);
									
									var cap = this.wpsPropertiesServiceInstance.capabilities;
									var version = this.wpsPropertiesServiceInstance.serviceVersion;
									
									console.log(cap);
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
								}
							} ]
				});