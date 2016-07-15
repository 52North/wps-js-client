angular
		.module('wpsExecuteSetupInputs')
		.component(
				'wpsExecuteSetupInputs',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsExecute/wpsExecuteSetupInputs/wps-execute-setup-inputs.template.html",

					controller : [
							'wpsExecuteInputService', 'wpsPropertiesService',
							function WpsExecuteSetupInputsController(
									wpsExecuteInputService, wpsPropertiesService) {
								/*
								 * reference to wpsPropertiesService instances
								 */
								this.wpsExecuteInputServiceInstance = wpsExecuteInputService;
								this.wpsPropertiesServiceInstance = wpsPropertiesService;
							
								this.literalInputButtonDisabled = true;
								this.complexInputButtonDisabled = true;
								this.boundingBoxInputButtonDisabled = true;

								this.onChangeExecuteInput = function(input){
									this.wpsExecuteInputServiceInstance.selectedExecuteInput = input;
								};
								
								this.onLiteralInputChange = function(){
									this.literalInputButtonDisabled = false;
								};
								
								this.addLiteralInput = function(){
									var selectedInput = this.wpsExecuteInputServiceInstance.selectedExecuteInput;
									this.wpsPropertiesServiceInstance.addLiteralInput(selectedInput);
								
									this.wpsExecuteInputServiceInstance.markInputAsConfigured(selectedInput);
									
									this.resetLiteralInputForm();
								};
								
								this.resetLiteralInputForm = function(){
									this.literalInputButtonDisabled = true;
									
									this.wpsExecuteInputServiceInstance.literalInputValue = undefined;
								}
								
								this.onComplexPayloadChange = function(){
									/*
									 * now everything for complex input is set up
									 * 
									 * enable button!
									 */
									
									this.complexInputButtonDisabled = false;
								};
								
								this.addComplexInput = function(){
									var selectedInput = this.wpsExecuteInputServiceInstance.selectedExecuteInput;
									this.wpsPropertiesServiceInstance.addComplexInput(selectedInput);
								
									this.wpsExecuteInputServiceInstance.markInputAsConfigured(selectedInput);
									
									this.resetComplexInputForm();
									
								};
								
								this.resetComplexInputForm = function(){
									this.complexInputButtonDisabled = true;
									
									this.wpsExecuteInputServiceInstance.selectedExecuteInputFormat = undefined;
									this.wpsExecuteInputServiceInstance.asReference = false;
									this.wpsExecuteInputServiceInstance.complexPayload = undefined;
								};
								
								this.onUpperCornerChange = function(){
									/*
									 * now everything for bbox input is set up
									 * 
									 * enable button!
									 */
									this.boundingBoxInputButtonDisabled = false;
								};
								
								this.addBoundingBoxInput = function(){
									var selectedInput = this.wpsExecuteInputServiceInstance.selectedExecuteInput;
									this.wpsPropertiesServiceInstance.addBoundingBoxInput(selectedInput);
								
									this.wpsExecuteInputServiceInstance.markInputAsConfigured(selectedInput);
									
									this.resetBoundingBoxInputForm();
								};
								
								this.resetBoundingBoxInputForm = function(){
									this.boundingBoxInputButtonDisabled = true;
									
									this.wpsExecuteInputServiceInstance.selectedExecuteInputCrs = undefined;
									this.wpsExecuteInputServiceInstance.bboxLowerCorner = undefined;
									this.wpsExecuteInputServiceInstance.bboxUpperCorner = undefined;
								};
								
								this.onChangeAlreadyDefinedExecuteInput = function(){
									/*
									 * user selected an already defined input
									 * 
									 * now identify it, show the corresponding form 
									 * and fill the form elements with the defined values!
									 */
									var selectedInput = this.wpsExecuteInputServiceInstance.selectedExecuteInput;
									
									var definedInput = this.getDefinedInput(selectedInput, this.wpsPropertiesServiceInstance.executeRequest.inputs);
									
									/*
									 * depending on the type of the definedInput 
									 * we have to fill in a different form
									 * 
									 * type may be "literal", "complex", "bbox" 
									 * according to InputGenerator-class from wps-js-lib library
									 */
									var type = definedInput.type;
									
									switch (type) {
									
									case "literal":
										this.fillLiteralInputForm(definedInput);
										break;
									
									case "complex":
										this.fillComplexInputForm(definedInput);
										break;
										
									case "bbox":
										this.fillBoundingBoxInputForm(definedInput);
									
									}
								};
								
								
								this.fillLiteralInputForm = function(literalInput){
									this.wpsExecuteInputServiceInstance.literalInputValue = literalInput.value;
								};
								
								this.fillBoundingBoxInputForm = function(bboxInput){
									this.wpsExecuteInputServiceInstance.selectedExecuteInputCrs = bboxInput.crs;
									this.wpsExecuteInputServiceInstance.bboxLowerCorner = bboxInput.lowerCorner;
									this.wpsExecuteInputServiceInstance.bboxUpperCorner = bboxInput.upperCorner;
								};
								
								this.fillComplexInputForm = function(complexInput){

									this.wpsExecuteInputServiceInstance.asReference = complexInput.asReference;
									
									this.wpsExecuteInputServiceInstance.complexPayload = complexInput.complexPayload;
									
									this.wpsExecuteInputServiceInstance.selectedExecuteInputFormat = this.getSelectedExecuteInputFormatcomplexInput(complexInput.mimeType, this.wpsExecuteInputServiceInstance.selectedExecuteInput.complexData.formats);
									
								};
								
								this.getSelectedExecuteInputFormatcomplexInput = function(mimeType, formatsList){
									var index;
									
									for(var i=0; i<formatsList.length; i++){
										var currentFormat = formatsList[i];
										
										/*
										 * some element must have the same identifier
										 */
										if(mimeType === currentFormat.mimeType){
											index = i;
											break;
										}		
									}
									
									return formatsList[index];
								};
								
								this.getDefinedInput = function(selectedInput, definedInputsList){
									var id = selectedInput.identifier;
									var index;
									
									for(var i=0; i<definedInputsList.length; i++){
										var currentDefinedInput = definedInputsList[i];
										
										/*
										 * some element must have the same identifier
										 */
										if(id === currentDefinedInput.identifier){
											index = i;
											break;
										}		
									}
									
									return definedInputsList[index];
								};

							} ]
				});