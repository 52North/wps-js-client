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

					this.executeResponse;

					this.getStatusRequest = {};
					this.getStatusResponse;

					this.getResultRequest = {};
					this.getResultResponse;
					
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
						this.wpsExecuteInputServiceInstance.unconfiguredExecuteInputs = [];
						this.wpsExecuteInputServiceInstance.unconfiguredExecuteInputs.push.apply(this.wpsExecuteInputServiceInstance.unconfiguredExecuteInputs, this.processDescription.process.inputs);
						this.wpsExecuteOutputServiceInstance.unconfiguredExecuteOutputs = [];
						this.wpsExecuteOutputServiceInstance.unconfiguredExecuteOutputs.push.apply(this.wpsExecuteOutputServiceInstance.unconfiguredExecuteOutputs, this.processDescription.process.outputs);
						
						/*
						 * reset already configured lists
						 */
						this.wpsExecuteInputServiceInstance.alreadyConfiguredExecuteInputs = [];
//						this.wpsExecuteOutputServiceInstance.alreadyConfiguredExecuteOutputs = undefined;
					};
					
					this.addLiteralInput = function(literalInput){
						if(! this.executeRequest.inputs)
							this.executeRequest.inputs = [];

						this.removeAlreadyExistingObjectWithSameIdentifier(literalInput);
						
						/*
						 * use InputGenerator of wps-js-lib library!
						 * 
						 * createLiteralDataInput_wps_1_0_and_2_0(identifier, dataType,
								uom, value) <-- only identifier and value are mandatory
						 */
						var newInput = this.inputGenerator.createLiteralDataInput_wps_1_0_and_2_0(literalInput.identifier, null,
								null, this.wpsExecuteInputServiceInstance.literalInputValue);
						
						this.executeRequest.inputs.push(newInput);
					};
					
					this.addLiteralOutput = function(literalOutput){
						if(! this.executeRequest.outputs)
							this.executeRequest.outputs = [];

						this.removeAlreadyExistingObjectWithSameIdentifier(literalOutput);
						
						/*
						 * use OutputGenerator of wps-js-lib library!
						 * 
						 * depends on service version!
						 * 
						 * createLiteralOutput_WPS_1_0 : function(identifier)
						 * 
						 * createLiteralOutput_WPS_2_0 : function(identifier, transmission)
						 */
						var newInput;
						if(this.serviceVersion === '1.0.0')
							newInput = this.outputGenerator.createLiteralOutput_WPS_1_0(literalOutput.identifier);
						else
							newInput = this.outputGenerator.createLiteralOutput_WPS_2_0(literalOutput.identifier,
									this.wpsExecuteOutputServiceInstance.selectedTransmissionMode);
						
						this.executeRequest.outputs.push(newInput);
					};
					
					this.addComplexInput = function(complexInput){
						if(! this.executeRequest.inputs)
							this.executeRequest.inputs = [];

						this.removeAlreadyExistingObjectWithSameIdentifier(complexInput);
						
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

						this.removeAlreadyExistingObjectWithSameIdentifier(complexOutput);
						
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
						
						var format = this.wpsExecuteInputServiceInstance.selectedExecuteInputFormat;
						
						var asReference = false;
						if(this.wpsExecuteOutputServiceInstance.selectedTransmissionMode === 'reference')
							asReference = true;
						
						var newInput;
						if(this.serviceVersion === '1.0.0')
							newInput = this.outputGenerator.createComplexOutput_WPS_1_0(complexOutput.identifier,
									format.mimeType, format.schema, format.encoding, null, asReference, null, null);
						else
							newInput = this.outputGenerator.createComplexOutput_WPS_2_0(complexOutput.identifier,
									format.mimeType, format.schema, format.encoding, 
									this.wpsExecuteOutputServiceInstance.selectedTransmissionMode);
						
						this.executeRequest.outputs.push(newInput);
					};
					
					this.addBoundingBoxInput = function(bboxInput){
						if(! this.executeRequest.inputs)
							this.executeRequest.inputs = [];

						this.removeAlreadyExistingObjectWithSameIdentifier(bboxInput);
						
						/*
						 * use InputGenerator of wps-js-lib library!
						 * 
						 * createBboxDataInput_wps_1_0_and_2_0 : function(identifier, crs,
					dimension, lowerCorner, upperCorner)  
							<-- only dimension is not mandatory
						 */
						
						var newInput = this.inputGenerator.createBboxDataInput_wps_1_0_and_2_0(bboxInput.identifier, 
								this.wpsExecuteInputServiceInstance.selectedExecuteInputCrs, null,
								this.wpsExecuteInputServiceInstance.bboxLowerCorner, 
								this.wpsExecuteInputServiceInstance.bboxUpperCorner);
						
						this.executeRequest.inputs.push(newInput);
					};
					
					this.addBoundingBoxOutput = function(bboxOutput){
						this.addLiteralOutput(bboxOutput);
					};
					
					this.removeAlreadyExistingObjectWithSameIdentifier = function(literalInput){
						var index = undefined;
						var isALreadyDefined = false;
						
						for(var i=0; i<this.executeRequest.inputs.length; i++){
							var currentInput = this.executeRequest.inputs[i];
							
							if(currentInput.identifier === literalInput.identifier){
								index = i;
								isALreadyDefined = true;
								break;
							}
						}
						
						if(isALreadyDefined)
							this.executeRequest.inputs.splice(index, 1);
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
				

				}]);