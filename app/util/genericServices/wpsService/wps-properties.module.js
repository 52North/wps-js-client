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

					/*
					 * this property represents the WpsService object of wps-js
					 * library that encapsulates the functionality to
					 * communicate with WPS
					 */
					this.wpsServiceLibrary;

					this.availableWpsServices = [
							"http://geoprocessing.demo.52north.org:8080/wps/WebProcessingService",
							"http://geostatistics.demo.52north.org/wps/WebProcessingService" ];

					this.serviceVersion = '1.0.0';
					this.selectedServiceUrl = 'invalidURL';
					
					this.selectedProcess = '';

					this.capabilities = {};

					this.processDescription = {};

					this.executeRequest = {};

					this.executeResponse = {};

					this.getStatusRequest = {};
					this.getStatusResponse = {};

					this.getResultRequest = {};
					this.getResultResponse = {};

					this.initializeWpsLibrary = function() {
						this.wpsServiceLibrary = new WpsService({
							url : this.selectedServiceUrl,
							version : this.serviceVersion
						});
					};

					this.getCapabilities = function(callbackFunction) {
						/*
						 * take currently selected URL and version and execute
						 * an getCapabilitiesRequest
						 */
						this.wpsServiceLibrary.getCapabilities_GET(callbackFunction);
					};
					
					
					
					this.onCapabilitiesChange = function(capabilitiesObject){
						this.capabilities = capabilitiesObject;
						
						/*
						 * modify list of available processes from capabilities!
						 */
					};

					this.describeProcess = function(callbackFunction) {
						/*
						 * take currently selected process and execute
						 * an describeProcessRequest
						 */
						this.wpsServiceLibrary.describeProcess_GET(callbackFunction, this.selectedProcess.identifier);
					};
					
					this.onProcessDescriptionChange = function(processDescription){
						this.processDescription = processDescription;
					};

					this.execute = function(callbackFunction) {
						/*
						 * TODO TBD
						 */
					};

					this.getStatus = function(callbackFunction) {
						/*
						 * TODO TBD
						 */
					};

					this.getResult = function(callbackFunction) {
						/*
						 * TODO TBD
						 */
					};

					this.addNewWpsServiceUrl = function(url) {
						if (url.startsWith('http')) {
							this.availableWpsServices.push(url);
						}
					};

					this.removeWpsServiceUrl = function() {
						for (var int = 0; int < this.availableWpsServices.length; int++) {
							if (this.availableWpsServices[int] == this.selectedServiceUrl) {
								this.availableWpsServices.splice(int, 1);

								this.selectedServiceUrl = 'invalidURL';
							}
						}
					};

				});