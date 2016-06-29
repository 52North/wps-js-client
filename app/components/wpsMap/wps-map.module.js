angular.module('wpsMap', []);

/**
 * a common serviceInstance that holds all needed properties and methods for
 * interacting with a map (openlayers).
 */
angular.module('wpsMap').service(
		'wpsMapService',
		function() {

			this.map;

			this.initializeMap = function() {

				this.map = new ol.Map({
					target : 'map',
					layers : [ new ol.layer.Tile({
						source : new ol.source.MapQuest({
							layer : 'osm'
						})
					}), ],
					view : new ol.View({
						center : ol.proj.transform([ 7.63, 51.95 ],
								'EPSG:4326', 'EPSG:3857'),
						zoom : 14
					}),
					controls : ol.control.defaults().extend(
							[ new ol.control.ScaleLine() ])
				});
			}

		});