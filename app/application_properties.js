var applicationProperties = {
    wpsServices: [
        "http://geoprocessing.demo.52north.org:8080/wps/WebProcessingService",
//        "https://riesgos.52north.org/wps/WebProcessingService",
        "http://tsunami-riesgos.awi.de:8080/wps/WebProcessingService"
    ],
    serviceVersion: "2.0.0",         // "1.0.0", "2.0.0"
    selectedServiceUrl: "http://tsunami-riesgos.awi.de:8080/wps/WebProcessingService",
    skipWpsSetup: true,              // true, false,
    reuseGeoJSONOutput: true
};