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
angular.module('wpsProperties').service('wpsPropertiesService', function() {

	/**
	 * initialize as disabled on not clickable
	 */
	this.serviceVersion = '1.0.0';
	this.serviceUrl = '';
	
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

});