angular
        .module('wpsSetup')
        .component(
                'wpsSetup',
                {
                    templateUrl: "components/wpsUserInterface/wpsControls/wpsSetup/wps-setup.template.html",
                    /*
                     * injected with a modules service method that manages
                     * enabled tabs
                     */
                    controller: [
                        'wpsPropertiesService', 'wpsFormControlService', '$scope', '$rootScope',
                        function WpsSetupController(wpsPropertiesService, wpsFormControlService, $scope, $rootScope) {
                            /*
                             * references to wpsPropertiesService and wpsFormControl instances
                             */
                            this.wpsPropertiesServiceInstance = wpsPropertiesService;
                            this.wpsPropertiesServiceInstance.selectedServiceUrl = '';

                            this.wpsFormControlServiceInstance = wpsFormControlService;

                            this.isRemoveButtonDisabled = true;

                            $scope.loadingData = false;

                            this.changeVersion = function () {
                                /*									
                                 * reset capabilities divs
                                 */
                                wpsFormControlService.capabilitiesSuccess_classAttribute = 'hidden';
                                wpsFormControlService.capabilitiesFailed_classAttribute = 'hidden';

                                /*
                                 * disable all tabs, will be enabled on capabilities response
                                 */
                                wpsPropertiesService.resetProcessDescription();
                                wpsFormControlService.disableTabs();
                                wpsFormControlService.resetTabContents();

                                if (this.wpsPropertiesServiceInstance.selectedServiceUrl != '' && this.wpsPropertiesServiceInstance.selectedServiceUrl != undefined) {
                                    wpsPropertiesService.initializeWpsLibrary();

                                    $scope.loadingData = true;

                                    wpsPropertiesService.getCapabilities(this.capabilitiesCallback);
                                }
                            };

                            this.changeWpsUrl = function () {
                                /*									
                                 * reset capabilities divs
                                 */
                                wpsFormControlService.capabilitiesSuccess_classAttribute = 'hidden';
                                wpsFormControlService.capabilitiesFailed_classAttribute = 'hidden';

                                /*
                                 * disable all tabs, will be enabled on capabilities response
                                 */
                                wpsPropertiesService.resetProcessDescription();
                                if (!$rootScope.skipWpsSetup) {
                                    wpsFormControlService.disableTabs();
                                    wpsFormControlService.resetTabContents();
                                }

                                $scope.loadingData = true;

                                wpsPropertiesService.initializeWpsLibrary();
                                wpsPropertiesService.getCapabilities(this.capabilitiesCallback);

                                this.isRemoveButtonDisabled = false;
                                wpsFormControlService.removeWpsServiceButton_classAttribute = 'enabled';
                            };

                            this.removeSelectedWps = function () {
                                wpsFormControlService.capabilitiesSuccess_classAttribute = 'hidden';
                                wpsFormControlService.capabilitiesFailed_classAttribute = 'hidden';

                                wpsPropertiesService.removeWpsServiceUrl();
                                wpsFormControlService.disableTabs();

                                this.isRemoveButtonDisabled = true;
                                wpsFormControlService.removeWpsServiceButton_classAttribute = 'disabled';
                            };

                            this.capabilitiesCallback = function (capabilitiesResponse) {

                                $scope.loadingData = false;

                                /*
                                 * check received capObject for reasonable structure.
                                 */
                                if (capabilitiesResponse.capabilities) {
                                    /*
                                     * re-call wpsPropertiesService to actually modify it's capabilities object
                                     */
                                    var capObject = capabilitiesResponse.capabilities;
                                    wpsPropertiesService.onCapabilitiesChange(capObject);

                                    wpsFormControlService.capabilitiesSuccess_classAttribute = '';

                                    /*
                                     * enable tabs vor wps version!
                                     */
                                    wpsFormControlService.enableTabs();


                                } else {
                                    /*
                                     * disable all tabs, since there is no valid data
                                     */
                                    wpsFormControlService.disableTabs();
                                    /*
                                     * error occurred!
                                     * enable error message
                                     */
                                    wpsFormControlService.capabilitiesFailed_errorThrown = capabilitiesResponse.errorThrown;
                                    wpsFormControlService.capabilitiesFailed_classAttribute = '';
                                }

                                /*
                                 * call $apply manually to modify service references
                                 */
 
                                $scope.$apply();
                            }
                            if ($rootScope.selectedServiceUrl != undefined &&
                                    $rootScope.selectedServiceUrl != "") {
                                this.wpsPropertiesServiceInstance.selectedServiceUrl = $rootScope.selectedServiceUrl;
                                this.changeWpsUrl();
                            }
                        }]

                });