angular
        .module('wpsExecuteSetupInputs')
        .component(
                'wpsExecuteSetupInputs',
                {
                    templateUrl: "components/wpsUserInterface/wpsControls/wpsExecute/wpsExecuteSetupRequest/wpsExecuteSetupInputs/wps-execute-setup-inputs.template.html",
                    controller: [
                        '$rootScope',
                        'wpsExecuteInputService',
                        'wpsPropertiesService',
                        'wpsFormControlService',
                        function WpsExecuteSetupInputsController(
                                $rootScope,
                                wpsExecuteInputService,
                                wpsPropertiesService,
                                wpsFormControlService) {
                            /*
                             * reference to wpsPropertiesService instances
                             */
                            this.wpsExecuteInputServiceInstance = wpsExecuteInputService;
                            this.wpsPropertiesServiceInstance = wpsPropertiesService;
                            this.wpsFormControlServiceInstance = wpsFormControlService;
                            
                            // controller layout items;
                            this.formData = {};
                            this.formData.complexDataInput = "drawing"; // start drawing option by default
                            this.mimeTypeSelection = "";
                            this.geoJsonSelected = false;

                            this.onChangeExecuteInput = function (input) {
                                this.wpsExecuteInputServiceInstance.selectedExecuteInput = input;
                                this.wpsFormControlServiceInstance.isRemoveInputButtonDisabled = true;
                                
                                this.resetAllInputForms();
                            };

                            this.addLiteralInput = function () {
                                var selectedInput = this.wpsExecuteInputServiceInstance.selectedExecuteInput;
                                this.wpsPropertiesServiceInstance.addLiteralInput(selectedInput);

                                this.wpsExecuteInputServiceInstance.markInputAsConfigured(selectedInput);

                                this.resetLiteralInputForm();
                            };

                            this.resetLiteralInputForm = function () {

                                this.wpsExecuteInputServiceInstance.literalInputValue = undefined;
                            };

                            this.addComplexInput = function () {
                                var selectedInput = this.wpsExecuteInputServiceInstance.selectedExecuteInput;
                                this.wpsPropertiesServiceInstance.addComplexInput(selectedInput);

                                this.wpsExecuteInputServiceInstance.markInputAsConfigured(selectedInput);

                                this.resetComplexInputForm();
                            };

                            this.resetComplexInputForm = function () {
                                this.wpsExecuteInputServiceInstance.selectedExecuteInputFormat = undefined;
                                this.wpsExecuteInputServiceInstance.asReference = false;
                                this.wpsExecuteInputServiceInstance.complexPayload = undefined;
                                
                                this.geoJsonSelected = false;
                                //disable drawing tools
                                $rootScope.$broadcast('set-complex-data-map-input-enabled', {'enabled': false});
                                
                                //this.wpsExecuteInputServiceInstance.removeDrawnItems();
                            };

                            this.addBoundingBoxInput = function () {
                                var selectedInput = this.wpsExecuteInputServiceInstance.selectedExecuteInput;
                                this.wpsPropertiesServiceInstance.addBoundingBoxInput(selectedInput);

                                this.wpsExecuteInputServiceInstance.markInputAsConfigured(selectedInput);

                                this.resetBoundingBoxInputForm();
                            };

                            this.resetBoundingBoxInputForm = function () {
                                this.wpsExecuteInputServiceInstance.selectedExecuteInputCrs = undefined;
                                this.wpsExecuteInputServiceInstance.bboxLowerCorner = undefined;
                                this.wpsExecuteInputServiceInstance.bboxUpperCorner = undefined;
                            };

                            this.resetAllInputForms = function () {
                                this.resetLiteralInputForm();
                                this.resetComplexInputForm();
                                this.resetBoundingBoxInputForm();
                            };

                            this.onChangeAlreadyDefinedExecuteInput = function () {
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

                                /*
                                 * enable removeButton
                                 */
                                this.wpsFormControlServiceInstance.isRemoveInputButtonDisabled = false;
                            };


                            this.fillLiteralInputForm = function (literalInput) {
                                this.wpsExecuteInputServiceInstance.literalInputValue = literalInput.value;
                            };

                            this.fillBoundingBoxInputForm = function (bboxInput) {
                                this.wpsExecuteInputServiceInstance.selectedExecuteInputCrs = bboxInput.crs;
                                this.wpsExecuteInputServiceInstance.bboxLowerCorner = bboxInput.lowerCorner;
                                this.wpsExecuteInputServiceInstance.bboxUpperCorner = bboxInput.upperCorner;
                            };

                            this.fillComplexInputForm = function (complexInput) {

                                this.wpsExecuteInputServiceInstance.asReference = complexInput.asReference;

                                this.wpsExecuteInputServiceInstance.complexPayload = complexInput.complexPayload;

                                this.wpsExecuteInputServiceInstance.selectedExecuteInputFormat = this.getSelectedExecuteInputFormatcomplexInput(complexInput.mimeType, this.wpsExecuteInputServiceInstance.selectedExecuteInput.complexData.formats);

                            };

                            this.getSelectedExecuteInputFormatcomplexInput = function (mimeType, formatsList) {
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

                            this.getDefinedInput = function (selectedInput, definedInputsList) {
                                var id = selectedInput.identifier;
                                var index;

                                for (var i = 0; i < definedInputsList.length; i++) {
                                    var currentDefinedInput = definedInputsList[i];

                                    /*
                                     * some element must have the same identifier
                                     */
                                    if (id === currentDefinedInput.identifier) {
                                        index = i;
                                        break;
                                    }
                                }

                                return definedInputsList[index];
                            };

                            this.removeAlreadyDefinedInput = function () {
                                /*
                                 * current input from list of already
                                 * defined inputs as well as from execute
                                 * request object 
                                 * 
                                 * and add it to list of not
                                 * defined inputs
                                 */
                                var currentInput = this.wpsExecuteInputServiceInstance.selectedExecuteInput;

                                this.wpsPropertiesServiceInstance.removeAlreadyExistingInputWithSameIdentifier(currentInput);

                                this.wpsExecuteInputServiceInstance.removeInputFromAlreadyDefinedInputs(currentInput);

                                this.wpsExecuteInputServiceInstance.addInputToUnconfiguredExecuteInputs(currentInput);

                                /*
                                 * disable removeButton
                                 */
                                this.wpsFormControlServiceInstance.isRemoveInputButtonDisabled = true;

                                this.resetAllInputForms();

                                /*
                                 * set selection to undefined as visual feedback (and prevent that the same 
                                 * input view is still shown)
                                 */
                                this.wpsExecuteInputServiceInstance.selectedExecuteInput = undefined;

                            };

                            this.complexInputChanged = function(inputSelection){
                                switch (inputSelection){
                                    case 'reference':
                                        console.log('reference selected');
                                        this.wpsExecuteInputServiceInstance.asReference = true;
                                        this.wpsExecuteInputServiceInstance.asComplex = false;
                                        $rootScope.$broadcast('set-complex-data-map-input-enabled', {'enabled': false});
                                        break;
                                    case 'file':
                                        this.wpsExecuteInputServiceInstance.asReference = false;
                                        this.wpsExecuteInputServiceInstance.asComplex = false;
                                        $rootScope.$broadcast('set-complex-data-map-input-enabled', {'enabled': false});
                                        console.log('file selected');
                                        break;
                                    case 'drawing':
                                        this.wpsExecuteInputServiceInstance.asReference = false;
                                        this.wpsExecuteInputServiceInstance.asComplex = false;
                                        $rootScope.$broadcast('set-complex-data-map-input-enabled', {'enabled': true});
                                        console.log('drawing selected');
                                        // if complexDataInput, enable leaflet plugin.
                                        // if boundingBoxDataInput, enable leaflet bb plugin
                                        break;
                                    case 'complex':
                                        this.wpsExecuteInputServiceInstance.asReference = false;
                                        this.wpsExecuteInputServiceInstance.asComplex = true;
                                        $rootScope.$broadcast('set-complex-data-map-input-enabled', {'enabled': false});
                                        console.log('complex selected');
                                        break;
                                }
                            }
                            
                            this.complexDataOptionSelected = function () {
                                console.log("Format selected:");
                                console.log(this.wpsExecuteInputServiceInstance.selectedExecuteInputFormat);
                                mimeTypeSelection = this.wpsExecuteInputServiceInstance.selectedExecuteInputFormat.mimeType;
                                console.log(mimeTypeSelection);
                                if (mimeTypeSelection === "application/vnd.geo+json") {
                                    console.log("geojson selected.");
                                    this.geoJsonSelected = true;
                                    this.formData.complexDataInput = "drawing";
                                    $rootScope.$broadcast('set-complex-data-map-input-enabled', {'enabled': true});
                                } else {
                                    console.log("no geojson selected.");
                                    this.geoJsonSelected = false;
                                    $rootScope.$broadcast('set-complex-data-map-input-enabled', {'enabled': false});
                                }
                            };

                        }]
                });