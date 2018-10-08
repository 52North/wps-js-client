angular
        .module('wpsExecute')
        .component(
                'wpsExecute',
                {
                    templateUrl: "components/wpsUserInterface/wpsControls/wpsExecute/wps-execute.template.html",
                    /*
                     * injected with a modules service method that manages
                     * enabled tabs
                     */
                    controller: [
                        'wpsContinueWithNewProcessService',
                        'wpsPropertiesService',
                        'wpsFormControlService',
                        function WpsExecuteController(
                                wpsContinueWithNewProcessService,
                                wpsPropertiesService,
                                wpsFormControlService) {
                            this.wpsContinueWithNewProcessServiceInstance = wpsContinueWithNewProcessService;
                            this.wpsPropertiesServiceInstance = wpsPropertiesService;
                            this.wpsFormControlServiceInstance = wpsFormControlService;
                        }]
                });