angular
		.module('wpsExecuteSetupInputs')
		.component(
				'wpsExecuteSetupInputs',
				{
					templateUrl : "components/wpsUserInterface/wpsControls/wpsExecute/wpsExecuteSetupInputs/wps-execute-setup-inputs.template.html",

					controller : [
							'wpsExecuteInputService', 'wpsPropertiesService', '$scope',
							function WpsExecuteSetupInputsController(
									wpsExecuteInputService, wpsPropertiesService, $scope) {
								/*
								 * reference to wpsPropertiesService instances
								 */
								this.wpsExecuteInputServiceInstance = wpsExecuteInputService;
								this.wpsPropertiesServiceInstance = wpsPropertiesService;
							
								this.literalInputButtonDisabled = true;

								this.onChangeExecuteInput = function(input){
									this.wpsExecuteInputServiceInstance.selectedExecuteInput = input;
								};
								
								this.onChangeExecuteOutput = function(output){
									this.wpsExecuteOutputServiceInstance.selectedExecuteOutput = output;
								};
								
								this.onLiteralInputChange = function(){
									this.literalInputButtonDisabled = false;
								};
								
								this.addLiteralInput = function(){
									var selectedInput = this.wpsExecuteInputServiceInstance.selectedExecuteInput;
									this.wpsPropertiesServiceInstance.addLiteralInput(selectedInput);
								
									this.wpsExecuteInputServiceInstance.markInputAsConfigured(selectedInput);
									
									/*
									 * disable button
									 */
									this.literalInputButtonDisabled = true;
								};

							} ]
				});