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
								this.wpsServices = [
										"http://geoprocessing.demo.52north.org:8080/wps/WebProcessingService",
										"http://geostatistics.demo.52north.org/wps/WebProcessingService" ];
								/*
								 * references to wpsPropertiesService and wpsFormControl instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;
								
								this.formControlInstance = wpsFormControlService;

								this.changeVersion = function() {
									wpsFormControlService.onWpsVersionChanged();
								}
								
								this.changeWpsUrl = function(){
									wpsFormControlService.onWpsUrlChanged()
								}
							} ]
				});