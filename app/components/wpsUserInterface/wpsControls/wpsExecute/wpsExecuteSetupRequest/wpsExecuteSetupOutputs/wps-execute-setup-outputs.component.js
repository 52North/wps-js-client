angular
        .module('wpsExecuteSetupOutputs')
        .component(
                'wpsExecuteSetupOutputs',
                {
                    templateUrl: "components/wpsUserInterface/wpsControls/wpsExecute/wpsExecuteSetupRequest/wpsExecuteSetupOutputs/wps-execute-setup-outputs.template.html",

                    controller: [
                        '$scope', 'wpsExecuteOutputService', 'wpsPropertiesService', 'wpsFormControlService',
                        function WpsExecuteSetupOutputsController(
                                $scope, wpsExecuteOutputService, wpsPropertiesService, wpsFormControlService) {
                            /*
                             * reference to wpsPropertiesService instances
                             */
                            this.wpsExecuteOutputServiceInstance = wpsExecuteOutputService;
                            this.wpsPropertiesServiceInstance = wpsPropertiesService;
                            this.wpsFormControlServiceInstance = wpsFormControlService;

                            this.complexOutputDataSetup = applicationProperties.complexOutputDataSetup;
                            $scope.hasDefaultFormat = false;
                            $scope.hasDefaultSchema = false;
                            $scope.hasDefaultEncoding = false;
                            $scope.formatIndex = 0;
                            this.onChangeExecuteOutput = function (output) {
                                $scope.hasDefaultFormat = false;
                                if (this.complexOutputDataSetup.defaultMimetypeIfAvailable.length > 0 &&
                                        output.complexData) {
                                    for (var format in output.complexData.formats) {
                                        if (output.complexData.formats[format].mimeType === this.complexOutputDataSetup.defaultMimetypeIfAvailable) {
                                            if (!$scope.hasDefaultFormat) {
                                                $scope.formatIndex = format;
                                            }
                                            $scope.hasDefaultFormat = true;
                                            if (output.complexData.formats[format].schema === this.complexOutputDataSetup.defaultSchemaIfAvailable &&
                                                    !$scope.hasDefaultSchema &&
                                                    !$scope.hasDefaultEncoding) {
                                                $scope.hasDefaultFormat = true;
                                                $scope.hasDefaultSchema = true;
                                                if (!$scope.hasDefaultEncoding) {
                                                    $scope.formatIndex = format;
                                                }
                                                if (output.complexData.formats[format].encoding === this.complexOutputDataSetup.defaultEncodingIfAvailable &&
                                                        !$scope.hasDefaultEncoding) {
                                                    $scope.hasDefaultEncoding = true;
                                                    $scope.formatIndex = format;
                                                }
                                            }
                                            if (output.complexData.formats[format].encoding === this.complexOutputDataSetup.defaultEncodingIfAvailable &&
                                                    !$scope.hasDefaultSchema &&
                                                    !$scope.hasDefaultEncoding) {
                                                $scope.hasDefaultFormat = true;
                                                $scope.hasDefaultEncoding = true;
                                                if (!$scope.hasDefaultSchema) {
                                                    $scope.formatIndex = format;
                                                }
                                                if (output.complexData.formats[format].schema === this.complexOutputDataSetup.defaultSchemaIfAvailable &&
                                                        !$scope.hasDefaultSchema) {
                                                    $scope.hasDefaultSchema = true;
                                                    $scope.formatIndex = format;
                                                }
                                            }
                                        }
                                    }
                                }
                                this.wpsExecuteOutputServiceInstance.selectedExecuteOutput = output;
                                console.log(output);
                                this.wpsFormControlServiceInstance.isRemoveOutputButtonDisabled = true;
                                if ($scope.hasDefaultFormat) {
                                    this.wpsExecuteOutputServiceInstance.selectedExecuteOutputFormat = output.complexData.formats[$scope.formatIndex];
                                }
                                console.log($scope.formatIndex);
                                console.log(this.wpsExecuteOutputServiceInstance.selectedExecuteOutputFormat);
                                
                                if (this.complexOutputDataSetup.defaultTransmissionMode.length > 0) {
                                    this.wpsExecuteOutputServiceInstance.selectedTransmissionMode = this.complexOutputDataSetup.defaultTransmissionMode;
                                }
                            };
                            
                            this.complexDataOptionSelected = function() {
                                console.log("Format selected:");
                                console.log(this.wpsExecuteOutputServiceInstance.selectedExecuteOutputFormat);
                            }

                            this.addLiteralOutput = function () {
                                var selectedOutput = this.wpsExecuteOutputServiceInstance.selectedExecuteOutput;
                                this.wpsPropertiesServiceInstance.addLiteralOutput(selectedOutput);

                                this.wpsExecuteOutputServiceInstance.markOutputAsConfigured(selectedOutput);

                            };

                            this.addComplexOutput = function () {
                                var selectedOutput = this.wpsExecuteOutputServiceInstance.selectedExecuteOutput;
                                this.wpsPropertiesServiceInstance.addComplexOutput(selectedOutput);

                                this.wpsExecuteOutputServiceInstance.markOutputAsConfigured(selectedOutput);

                            };

                            this.addBoundingBoxOutput = function () {
                                var selectedOutput = this.wpsExecuteOutputServiceInstance.selectedExecuteOutput;
                                this.wpsPropertiesServiceInstance.addBoundingBoxOutput(selectedOutput);

                                this.wpsExecuteOutputServiceInstance.markOutputAsConfigured(selectedOutput);
                            };

                            this.onChangeAlreadyDefinedExecuteOutput = function () {
                                /*
                                 * user selected an already defined output
                                 * 
                                 * now identify it, show the corresponding form 
                                 * and fill the form elements with the defined values!
                                 */
                                var selectedOutput = this.wpsExecuteOutputServiceInstance.selectedExecuteOutput;

                                var definedOutput = this.getDefinedOutput(selectedOutput, this.wpsPropertiesServiceInstance.executeRequest.outputs);

                                /*
                                 * depending on the type of the definedOutput 
                                 * we have to fill in a different form
                                 * 
                                 * type may be "literal", "complex", "bbox" 
                                 * according to OutputGenerator-class from wps-js-lib library
                                 */
                                var type = definedOutput.type;

                                switch (type) {

                                    case "literal":
                                        this.fillLiteralOutputForm(definedOutput);
                                        break;

                                    case "complex":
                                        this.fillComplexOutputForm(definedOutput);
                                        break;

                                    case "bbox":
                                        this.fillBoundingBoxOutputForm(definedOutput);

                                }

                                this.wpsFormControlServiceInstance.isRemoveOutputButtonDisabled = false;
                            };


                            this.fillLiteralOutputForm = function (literalOutput) {
                                /*
                                 * for WPS 2.0 output has a property named "transmission"
                                 */
                                if (literalOutput.transmission)
                                    this.wpsExecuteOutputServiceInstance.selectedTransmissionMode = this.getSelectedTransmissionMode(literalOutput.transmission, this.wpsPropertiesServiceInstance.processDescription.outputTransmissionModes);
                                
                                /*
                                 * WPS 1.0 outputs store information as property "asReference"
                                 */
                                else if (literalOutput.asReference)
                                    this.wpsExecuteOutputServiceInstance.selectedTransmissionMode = "reference";

                                else
                                    this.wpsExecuteOutputServiceInstance.selectedTransmissionMode = "value";
                            };

                            this.fillBoundingBoxOutputForm = function (bboxOutput) {
                                /*
                                 * for WPS 2.0 output has a property named "transmission"
                                 */
                                if (bboxOutput.transmission)
                                    this.wpsExecuteOutputServiceInstance.selectedTransmissionMode = this.getSelectedTransmissionMode(bboxOutput.transmission, this.wpsPropertiesServiceInstance.processDescription.outputTransmissionModes);

                                /*
                                 * WPS 1.0 outputs store information as property "asReference"
                                 */
                                else if (bboxOutput.asReference)
                                    this.wpsExecuteOutputServiceInstance.selectedTransmissionMode = "reference";

                                else
                                    this.wpsExecuteOutputServiceInstance.selectedTransmissionMode = "value";
                            };

                            this.fillComplexOutputForm = function (complexOutput) {

                                this.wpsExecuteOutputServiceInstance.selectedExecuteOutputFormat = this.getSelectedExecuteOutputFormat(complexOutput.mimeType, this.wpsExecuteOutputServiceInstance.selectedExecuteOutput.complexData.formats);
                                console.log(this.wpsExecuteOutputServiceInstance.selectedExecuteOutputFormat);
                                /*
                                 * for WPS 2.0 output has a property named "transmission"
                                 */
                                if (complexOutput.transmission)
                                    this.wpsExecuteOutputServiceInstance.selectedTransmissionMode = this.getSelectedTransmissionMode(complexOutput.transmission, this.wpsPropertiesServiceInstance.processDescription.outputTransmissionModes);                                
                                
                                /*
                                 * WPS 1.0 outputs store information as property "asReference"
                                 */
                                else if (complexOutput.asReference)
                                    this.wpsExecuteOutputServiceInstance.selectedTransmissionMode = "reference";

                                else
                                    this.wpsExecuteOutputServiceInstance.selectedTransmissionMode = "value";
                                
                            };

                            this.getSelectedExecuteOutputFormat = function (mimeType, formatsList) {
                                var index;

                                for (var i = 0; i < formatsList.length; i++) {
                                    var currentFormat = formatsList[i];

                                    /*
                                     * some element must have the same identifier
                                     */
                                    if (mimeType === currentFormat.mimeType) {
                                        index = i;
                                        break;
                                    }
                                }

                                return formatsList[index];
                            };

                            this.getSelectedTransmissionMode = function (transmissionMode, availableTransmissionModes) {
                                var index;

                                for (var i = 0; i < availableTransmissionModes.length; i++) {
                                    var currentTransmissionMode = availableTransmissionModes[i];

                                    /*
                                     * some element must have the same identifier
                                     */
                                    if (transmissionMode === currentTransmissionMode) {
                                        index = i;
                                        break;
                                    }
                                }

                                return availableTransmissionModes[index];
                            };

                            this.getDefinedOutput = function (selectedOutput, definedOutputsList) {
                                var id = selectedOutput.identifier;
                                var index;

                                for (var i = 0; i < definedOutputsList.length; i++) {
                                    var currentDefinedOutput = definedOutputsList[i];

                                    /*
                                     * some element must have the same identifier
                                     */
                                    if (id === currentDefinedOutput.identifier) {
                                        index = i;
                                        break;
                                    }
                                }

                                return definedOutputsList[index];
                            };

                            this.removeAlreadyDefinedOutput = function () {
                                /*
                                 * current output from list of already
                                 * defined outputs as well as from execute
                                 * request object 
                                 * 
                                 * and add it to list of not
                                 * defined outputs
                                 */
                                var currentOutput = this.wpsExecuteOutputServiceInstance.selectedExecuteOutput;

                                this.wpsPropertiesServiceInstance.removeAlreadyExistingOutputWithSameIdentifier(currentOutput);

                                this.wpsExecuteOutputServiceInstance.removeOutputFromAlreadyDefinedOutputs(currentOutput);

                                this.wpsExecuteOutputServiceInstance.addOutputToUnconfiguredExecuteOutputs(currentOutput);

                                /*
                                 * disable removeButton
                                 */
                                this.wpsFormControlServiceInstance.isRemoveOutputButtonDisabled = true;

                                //this.resetAllOutputForms();

                                /*
                                 * set selection to undefined as visual feedback (and prevent that the same 
                                 * output view is still shown)
                                 */
                                this.wpsExecuteOutputServiceInstance.selectedExecuteOutput = undefined;

                            }

                        }]
                });