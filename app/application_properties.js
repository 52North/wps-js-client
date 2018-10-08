var applicationProperties = {
    wpsServices: [
        "http://geoprocessing.demo.52north.org:8080/wps/WebProcessingService",
        "https://riesgos.52north.org/wps/WebProcessingService",
        "http://tsunami-riesgos.awi.de:8080/wps/WebProcessingService"
    ],
    serviceVersion: "2.0.0",         // "1.0.0", "2.0.0"
    selectedServiceUrl: "https://riesgos.52north.org/wps/WebProcessingService",
    skipWpsSetup: true,              // true, false,
    reuseGeoJSONOutput: true,
//    mapStartCenter: [ -7.0592, 105.5438], // [lat, lng]
    mapStartCenter: [ - 33.2551, -70.8676 ],
    mapStartZoom: 7,
    defaultLanguage: "en"           // "en", "de"
};