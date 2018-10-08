angular
        .module('wpsCapabilities')
        .component(
                'wpsCapabilities',
                {
                    templateUrl: "components/wpsUserInterface/wpsControls/wpsCapabilities/wps-capabilities.template.html",
                    controller: ['wpsPropertiesService', function WpsCapabilitiesController(
                                wpsPropertiesService) {

                        }
                    ]});