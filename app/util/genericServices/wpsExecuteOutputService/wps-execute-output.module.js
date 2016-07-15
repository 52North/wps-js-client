angular.module('wpsExecuteOutput', []);

/**
 * a common serviceInstance that holds attributes and methods needed for
 * configuring execute outputs
 */
angular.module('wpsExecuteOutput').service('wpsExecuteOutputService', function() {

	/*
	 * execute lists
	 */
	this.unconfiguredExecuteOutputs = [];
	this.alreadyConfiguredExecuteOutputs = [];

	this.selectedExecuteOutput;

	this.selectedTransmissionMode;
	
	/*
	 * complexOutput
	 */
	this.selectedExecuteOutputFormat;

	this.markOutputAsConfigured = function(output) {
		/*
		 * move the output with the fitting identifier from unconfigured output
		 * list to configured.
		 */
		/*
		 * remove output
		 */
		var index = undefined;
		var alreadyExists = false;

		for (var i = 0; i < this.unconfiguredExecuteOutputs.length; i++) {
			var currentOutput = this.unconfiguredExecuteOutputs[i];

			if (currentOutput.identifier === output.identifier) {
				index = i;
				alreadyExists = true;
				break;
			}
		}

		if(alreadyExists)
			this.unconfiguredExecuteInputs.splice(index, 1);

		/*
		 * add output
		 */
		index = undefined;
		alreadyExists = false;
		
		if(! this.alreadyConfiguredExecuteInputs)
			this.alreadyConfiguredExecuteInputs = [];
		
		for (var i = 0; i < this.alreadyConfiguredExecuteInputs.length; i++) {
			var currentInput = this.alreadyConfiguredExecuteInputs[i];

			if (currentInput.identifier === output.identifier) {
				index = i;
				alreadyExists = true;
				break;
			}
		}
		
		if(alreadyExists)
			this.alreadyConfiguredExecuteInputs.splice(index, 1);
		
		this.alreadyConfiguredExecuteInputs.push(output);
		
		/*
		 * set selection to undefined as visual feedback (and prevent that the same 
		 * output view is still shown)
		 */
		this.selectedExecuteInput = undefined;
	};
	
	this.reset = function(){
		this.unconfiguredExecuteOutputs = undefined;
		this.alreadyConfiguredExecuteOutputs = undefined;

		this.selectedExecuteOutput = undefined;
		
		this.selectedTransmissionMode = undefined;
		
		/*
		 * complexOutput
		 */
		this.selectedExecuteOutputFormat = undefined;
	};

});