angular
		.module('wpsAddServiceModal')
		.component(
				'wpsAddServiceModal',
				{
					templateUrl : "components/wpsSetup/modal/wps-add-service-modal.template.html",

					controller : [
							'wpsPropertiesService',
							function WpsAddServiceModalController(
									wpsPropertiesService) {

								/*
								 * references to wpsPropertiesService and
								 * wpsFormControl instances
								 */
								this.wpsPropertiesServiceInstance = wpsPropertiesService;

								this.temporaryWpsURL;

								this.addNewWpsServiceButton_classAttribute = 'disabled';
								this.isDisabled = true;
								this.alertMessage_classAttribute = 'display:none';

								this.tryAddNewWpsServiceUrl = function() {
									if (this.temporaryWpsURL.startsWith('http') && !(this.temporaryWpsURL.indexOf(' ') > -1))
										this.wpsPropertiesServiceInstance
												.addNewWpsServiceUrl(this.temporaryWpsURL);
									else {
										this.addNewWpsServiceButton_classAttribute = 'disabled';
										/*
										 * show alert message
										 */
										this.alertMessage_classAttribute = '';
									}
								};

								this.toggleSubmitButton = function() {
									if (this.temporaryWpsURL.startsWith('http')){
										this.isDisabled = false;
										this.addNewWpsServiceButton_classAttribute = 'enabled';
										
									}
									else {
										this.isDisabled = true;
										this.addNewWpsServiceButton_classAttribute = 'disabled';
										
									}
								};
							} ]
				});