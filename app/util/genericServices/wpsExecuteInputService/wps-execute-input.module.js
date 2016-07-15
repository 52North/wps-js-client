angular.module('wpsExecuteInput', []);

/**
 * a common serviceInstance that holds attributes and methods needed for
 * configuring execute inputs
 */
angular.module('wpsExecuteInput').service('wpsExecuteInputService', function() {

	/*
	 * execute lists
	 */
	this.unconfiguredExecuteInputs;
	this.alreadyConfiguredExecuteInputs = [];

	this.selectedExecuteInput;

	this.literalInputValue;
	
	this.selectedExecuteInputFormat;
	this.asReference = false;
	this.complexPayload;

	this.markInputAsConfigured = function(input) {
		/*
		 * move the input with the fitting identifier from unconfigured input
		 * list to configured.
		 */
		/*
		 * remove input
		 */
		var index = undefined;
		var alreadyExists = false;

		for (var i = 0; i < this.unconfiguredExecuteInputs.length; i++) {
			var currentInput = this.unconfiguredExecuteInputs[i];

			if (currentInput.identifier === input.identifier) {
				index = i;
				alreadyExists = true;
				break;
			}
		}

		if(alreadyExists)
			this.unconfiguredExecuteInputs.splice(index, 1);

		/*
		 * add input
		 */
		index = undefined;
		alreadyExists = false;
		
		if(! this.alreadyConfiguredExecuteInputs)
			this.alreadyConfiguredExecuteInputs = [];
		
		for (var i = 0; i < this.alreadyConfiguredExecuteInputs.length; i++) {
			var currentInput = this.alreadyConfiguredExecuteInputs[i];

			if (currentInput.identifier === input.identifier) {
				index = i;
				alreadyExists = true;
				break;
			}
		}
		
		if(alreadyExists)
			this.alreadyConfiguredExecuteInputs.splice(index, 1);
		
		this.alreadyConfiguredExecuteInputs.push(input);
		
		/*
		 * set selection to undefined as visual feedback (and prevent that the same 
		 * input view is still shown)
		 */
		this.selectedExecuteInput = undefined;
	};

});