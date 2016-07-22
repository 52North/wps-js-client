angular.module('wpsProperties', ['wpsExecuteInput', 'wpsExecuteOutput']);

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
				'wpsPropertiesService', ['wpsExecuteInputService', 'wpsExecuteOutputService',
				function(wpsExecuteInputService, wpsExecuteOutputService) {
					
					this.wpsExecuteInputServiceInstance = wpsExecuteInputService;
					this.wpsExecuteOutputServiceInstance = wpsExecuteOutputService;

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

					this.capabilities;

					this.processDescription;

					this.executeRequest = {};

					/*
					 * this property is used to store execute result document from WPS 2.0.0
					 */
					this.resultDocument_wps_2_0;
					
					/*
					 * this property is used to store execute response document from WPS 1.0.0
					 */
					this.responseDocument_wps_1_0;
					
					/*
					 * only used for WPS 2.0 status info document
					 */
					this.statusInfoDocument_wps_2_0;
					
					/*
					 * used if wps responds with raw output
					 */
					this.rawOutput;

					this.getStatusRequest = {};

					this.getResultRequest = {};
					
					this.inputGenerator = new InputGenerator();
					this.outputGenerator = new OutputGenerator();

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
						
						/*
						 * set all inputs and outputs as non configured for executeRequest!
						 */
						this.resetExecuteContents();
					};
					
					this.resetProcessDescription = function(){
						/*
						 * remove currently selected process
						 */
						this.selectedProcess = undefined;
						this.processDescription = undefined;
					};
					
					this.resetExecuteContents = function(){
						this.executeRequest = {};
						
						this.wpsExecuteInputServiceInstance.unconfiguredExecuteInputs = [];
						this.wpsExecuteOutputServiceInstance.unconfiguredExecuteOutputs = [];
						this.wpsExecuteInputServiceInstance.alreadyConfiguredExecuteInputs = [];
						this.wpsExecuteOutputServiceInstance.alreadyConfiguredExecuteOutputs = [];
						
						this.executeRequest.responseFormat = undefined;
						this.executeRequest.executionMode = undefined;
						
						if(this.processDescription){
							this.wpsExecuteInputServiceInstance.unconfiguredExecuteInputs.push.apply(this.wpsExecuteInputServiceInstance.unconfiguredExecuteInputs, this.processDescription.process.inputs);
							this.wpsExecuteOutputServiceInstance.unconfiguredExecuteOutputs.push.apply(this.wpsExecuteOutputServiceInstance.unconfiguredExecuteOutputs, this.processDescription.process.outputs);
						}
					};
					
					this.addLiteralInput = function(literalInput){
						if(! this.executeRequest.inputs)
							this.executeRequest.inputs = [];

						this.removeAlreadyExistingInputWithSameIdentifier(literalInput);
						
						/*
						 * use InputGenerator of wps-js-lib library!
						 * 
						 * createLiteralDataInput_wps_1_0_and_2_0(identifier, dataType,
								uom, value) <-- only identifier and value are mandatory
						 */
						var newInput = this.inputGenerator.createLiteralDataInput_wps_1_0_and_2_0(literalInput.identifier, undefined,
								undefined, this.wpsExecuteInputServiceInstance.literalInputValue);
						
						this.executeRequest.inputs.push(newInput);
					};
					
					this.addLiteralOutput = function(literalOutput){
						if(! this.executeRequest.outputs)
							this.executeRequest.outputs = [];

						this.removeAlreadyExistingOutputWithSameIdentifier(literalOutput);
						
						/*
						 * use OutputGenerator of wps-js-lib library!
						 * 
						 * depends on service version!
						 * 
						 * createLiteralOutput_WPS_1_0 : function(identifier)
						 * 
						 * createLiteralOutput_WPS_2_0 : function(identifier, transmission)
						 */
						var newOutput;
						if(this.serviceVersion === '1.0.0')
							newOutput = this.outputGenerator.createLiteralOutput_WPS_1_0(literalOutput.identifier);
						else
							newOutput = this.outputGenerator.createLiteralOutput_WPS_2_0(literalOutput.identifier,
									this.wpsExecuteOutputServiceInstance.selectedTransmissionMode);
						
						this.executeRequest.outputs.push(newOutput);
					};
					
					this.addComplexInput = function(complexInput){
						if(! this.executeRequest.inputs)
							this.executeRequest.inputs = [];

						this.removeAlreadyExistingInputWithSameIdentifier(complexInput);
						
						/*
						 * use InputGenerator of wps-js-lib library!
						 * 
						 * createComplexDataInput_wps_1_0_and_2_0 : function(identifier,
							mimeType, schema, encoding, asReference, complexPayload) 
							<-- only identifier and complexPayload are mandatory
						 */
						
						var format = this.wpsExecuteInputServiceInstance.selectedExecuteInputFormat;
						
						var newInput = this.inputGenerator.createComplexDataInput_wps_1_0_and_2_0(complexInput.identifier, 
								format.mimeType, format.schema, format.encoding, 
								this.wpsExecuteInputServiceInstance.asReference, 
								this.wpsExecuteInputServiceInstance.complexPayload);
						
						this.executeRequest.inputs.push(newInput);
					};
					
					this.addComplexOutput = function(complexOutput){
						if(! this.executeRequest.outputs)
							this.executeRequest.outputs = [];

						this.removeAlreadyExistingOutputWithSameIdentifier(complexOutput);
						
						/*
						 * use OutputGenerator of wps-js-lib library!
						 * 
						 * depends on service version!
						 * 
						 * createComplexOutput_WPS_1_0 : function(identifier, mimeType, schema,
								encoding, uom, asReference, title, abstractValue)
								
							createComplexOutput_WPS_2_0 : function(identifier, mimeType, schema,
								encoding, transmission)
						 */
						
						var format = this.wpsExecuteOutputServiceInstance.selectedExecuteOutputFormat;
						
						var asReference = false;
						if(this.wpsExecuteOutputServiceInstance.selectedTransmissionMode === 'reference')
							asReference = true;
						
						var newOutput;
						if(this.serviceVersion === '1.0.0')
							newOutput = this.outputGenerator.createComplexOutput_WPS_1_0(complexOutput.identifier,
									format.mimeType, format.schema, format.encoding, undefined, asReference, undefined, undefined);
						else
							newOutput = this.outputGenerator.createComplexOutput_WPS_2_0(complexOutput.identifier,
									format.mimeType, format.schema, format.encoding, 
									this.wpsExecuteOutputServiceInstance.selectedTransmissionMode);
						
						this.executeRequest.outputs.push(newOutput);
					};
					
					this.addBoundingBoxInput = function(bboxInput){
						if(! this.executeRequest.inputs)
							this.executeRequest.inputs = [];

						this.removeAlreadyExistingInputWithSameIdentifier(bboxInput);
						
						/*
						 * use InputGenerator of wps-js-lib library!
						 * 
						 * createBboxDataInput_wps_1_0_and_2_0 : function(identifier, crs,
					dimension, lowerCorner, upperCorner)  
							<-- only dimension is not mandatory
						 */
						
						var newInput = this.inputGenerator.createBboxDataInput_wps_1_0_and_2_0(bboxInput.identifier, 
								this.wpsExecuteInputServiceInstance.selectedExecuteInputCrs, undefined,
								this.wpsExecuteInputServiceInstance.bboxLowerCorner, 
								this.wpsExecuteInputServiceInstance.bboxUpperCorner);
						
						this.executeRequest.inputs.push(newInput);
					};
					
					this.addBoundingBoxOutput = function(bboxOutput){
						this.addLiteralOutput(bboxOutput);
					};
					
					this.removeAlreadyExistingInputWithSameIdentifier = function(input){
						var index = undefined;
						var isALreadyDefined = false;
						
						for(var i=0; i<this.executeRequest.inputs.length; i++){
							var currentInput = this.executeRequest.inputs[i];
							
							if(currentInput.identifier === input.identifier){
								index = i;
								isALreadyDefined = true;
								break;
							}
						}
						
						if(isALreadyDefined)
							this.executeRequest.inputs.splice(index, 1);
					};
					
					this.removeAlreadyExistingOutputWithSameIdentifier = function(output){
						var index = undefined;
						var isALreadyDefined = false;
						
						for(var i=0; i<this.executeRequest.outputs.length; i++){
							var currentOutput = this.executeRequest.outputs[i];
							
							if(currentOutput.identifier === output.identifier){
								index = i;
								isALreadyDefined = true;
								break;
							}
						}
						
						if(isALreadyDefined)
							this.executeRequest.outputs.splice(index, 1);
					};

					this.execute = function(callbackFunction) {
						
						this.resetResponseDocuments();
						
						/*
						 * collect execute request information and
						 * perfrom execute request
						 * 
						 * API interface from wps-js-lib
						 * execute : function(callbackFunction, processIdentifier, responseFormat,
								executionMode, lineage, inputs, outputs)
						 */
						
						var processIdentifier = this.selectedProcess.identifier;
						var responseFormat = this.executeRequest.responseFormat;
						/*
						 * this.executeRequest.executionMode has value "sync-execute" or "async-execute"
						 * 
						 * but execute request expects either "sync" or "async".
						 * 
						 * Hence we split the value!
						 */
						var executionMode = this.executeRequest.executionMode.split("-")[0];
						var lineage = false; /* only applicable for wps 1.0; we just leave it out */
						var inputs = this.executeRequest.inputs;
						var outputs = this.executeRequest.outputs;
														
						this.wpsServiceLibrary.execute(
										callbackFunction, processIdentifier,
										responseFormat, executionMode, lineage,
										inputs, outputs);
						
						/*
						 * reset execute contents
						 */
						this.resetExecuteContents();
					};
					
					this.resetResponseDocuments = function(){
						this.resultDocument_wps_2_0 = undefined;
						this.responseDocument_wps_1_0 = undefined;
						this.statusInfoDocument_wps_2_0 = undefined;
						this.rawOutput = undefined;
					};
					
					this.onExecuteResponseChange = function(executeResponse){

						/*
						 * based on the type of the response, a different concrete 
						 * property is instantiated
						 */
						
						switch (executeResponse.type){
						case "responseDocument":
							this.responseDocument_wps_1_0 = executeResponse.responseDocument;
							break;
						
						case "resultDocument":
							this.resultDocument_wps_2_0 = executeResponse.responseDocument;
							break;
							
						case "statusInfoDocument":
							this.statusInfoDocument_wps_2_0 = executeResponse.responseDocument;
							break;
							
						case "rawOutput":
							this.rawOutput = executeResponse.responseDocument;
							break;
						}
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
				

				}]);