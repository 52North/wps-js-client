angular.module('wpsProperties', []);

/**
 * a common serviceInstance that holds all needed properties for a WPS service.
 * 
 * This service represents a shared object ´which is used across the different
 * application tabs/components like Setup, Capabilities, Execute etc.
 * 
 * This way, one single service instance can be used to easily share values and
 * parameters for each WPS operation represented by different Angular components
 */
angular
		.module('wpsProperties')
		.service(
				'wpsPropertiesService',
				function() {

					this.availableWpsServices = [
							"http://geoprocessing.demo.52north.org:8080/wps/WebProcessingService",
							"http://geostatistics.demo.52north.org/wps/WebProcessingService" ];

					this.serviceVersion = '1.0.0';
					this.selectedServiceUrl = '';

					this.capabilities = {};

					this.processDescription = {};

					this.executeRequest = {};

					this.executeResponse = {};

					this.getStatusRequest = {};
					this.getStatusResponse = {};

					this.getResultRequest = {};
					this.getResultResponse = {};

					this.getCapabilities = function() {
						/*
						 * TODO TBD
						 */
					};

					this.describeProcess = function() {
						/*
						 * TODO TBD
						 */
					};

					this.execute = function() {
						/*
						 * TODO TBD
						 */
					};

					this.getStatus = function() {
						/*
						 * TODO TBD
						 */
					};

					this.getResult = function() {
						/*
						 * TODO TBD
						 */
					};

					this.addNewWpsServiceUrl = function(url) {
						if (url.startsWith('http')) {
							this.availableWpsServices
									.push(url);
						}
					};

					this.removeWpsServiceUrl = function() {
						for (var int = 0; int < this.availableWpsServices.length; int++) {
							if (this.availableWpsServices[int] == this.selectedServiceUrl){
								this.availableWpsServices.splice(int, 1);
								
								this.selectedServiceUrl = '';
							}
						}
					};

				});