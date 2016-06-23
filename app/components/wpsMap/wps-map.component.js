angular.module('wpsMap').component(
		'wpsMap',
		{
			templateUrl : "components/wpsMap/wps-map.template.html",
			controller : function MapController() {

				this.map;

				this.initializeMap = function() {

					/*
					 * TODO better use a service that handles map creation, interaction etc!!!
					 */
					
					var map = new ol.Map({
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

			}
		});