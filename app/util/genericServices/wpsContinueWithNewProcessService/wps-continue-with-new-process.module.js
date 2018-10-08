angular.module('wpsContinueWithNewProcess', []);

/**
 * a common serviceInstance that holds attributes and methods needed for
 * configuring execute inputs
 */
angular.module('wpsContinueWithNewProcess').service('wpsContinueWithNewProcessService', [
    '$rootScope',
    'wpsExecuteInputService',
    function (
            $rootScope,
            wpsExecuteInputService) {

        this.wpsExecuteInputServiceInstance = wpsExecuteInputService;
        this.reuseGeoJSONOutput = $rootScope.reuseGeoJSONOutput;

        this.processIsExecuted = false;

        console.log("wpsContinueWithNewProcessService started.");

    }]);