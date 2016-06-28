angular
		.module('wpsSetup')
		.component(
				'wpsSetup',
				{
					templateUrl : "components/wpsSetup/wps-setup.template.html",
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
								
								this.formControlInstance = wpsFormControlService;

								this.changeVersion = function() {
									wpsFormControlService.onWpsVersionChanged();
								};
								
								this.changeWpsUrl = function(){
									wpsFormControlService.onWpsUrlChanged()
								};
								
								this.removeSelectedWps = function(){
									this.wpsPropertiesServiceInstance.removeWpsServiceUrl();
									this.formControlInstance.onWpsUrlChanged()
								};
							} ]
				});