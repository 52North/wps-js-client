angular.module('wpsGeometricOutput', [ ]);

/**
 * a common serviceInstance that holds all needed properties for a WPS service.
 * 
 * This service represents a shared object ´which is used across the different
 * application tabs/components like Setup, Capabilities, Execute etc.
 * 
 * This way, one single service instance can be used to easily share values and
 * parameters for each WPS operation represented by different Angular components
 */
angular.module('wpsGeometricOutput').service('wpsGeometricOutputService', 
		[ function() {

			this.getGeometricOutputs = function(allOutputs){
				
				/*
				 * inspect array of outputs for geometric outputs only
				 * 
				 * first concentrate on GeoJSON output
				 * 
				 * TODO future task: transform other geometric formats to GeoJSON
				 * using a special WPS 
				 */
				
				/*
				 * create empty new array "geometricOutputs"
				 */
				
				var geometricOutputs = new Array();
				
				/*
				 * only geometric outputs shall be put into array "geometricOutputs"
				 */
				
				for (i=0; i < allOutputs.length; i++){
					var currentOutput = allOutputs[i];

					// is geometric output?
					if(this.isGeometricFormat(currentOutput)){
						
						// is GeoJSON
						if(this.isGeoJSON(currentOutput)){
							geometricOutputs.push(currentOutput);
						}
						
						// is not GeoJSON but can be converted to GeoJSON								
						else if(this.canBeTransformedToGeoJSON(currentOutput)){
							/*
							 * TODO transform to GeoJSOn using special WPS instance
							 * 
							 * and add to "geometricOutputs" array
							 */
						}
						
					}
				}
				
				/*
				 * new all geometric outputs have been found.
				 * 
				 * return array "geometricOutputs"
				 */
				return geometricOutputs;
			};
			
			this.isGeometricFormat = function(currentOutput){
				/*
				 * check if mimeType / format of output is supported
				 */
				
				if(currentOutput.data.complexData)
					return this.isGeometricFormat_complexData(currentOutput);
				
				//bounding box is always geometric
				else if(currentOutput.data.boundingBox)
					return true;
				
				else 
					return false;
			};
			
			this.isGeometricFormat_complexData = function(currentOutput){
				var format = currentOutput.data.complexData.mimeType;
				
				if (this.isFormatSupported(format))
					return true;
				
				else
					return false;
			};
			
			this.isFormatSupported = function(format){
				/*
				 * TODO implement better way using an external file of supported formats
				 */
				
				if (format === 'application/vnd.geo+json')
					return true;
			};
			
			this.isGeoJSON = function(currentOutput){
				var format = currentOutput.data.complexData.mimeType;
				
				if (format === 'application/vnd.geo+json')
					return true;
			};
			
			this.canBeTransformedToGeoJSON = function(currentOutput){
				/*
				 * TODO implement
				 */
			};
			
			this.transformToGeoJSON = function(currentOutput){
				/*
				 * TODO implement using a special WPS that transforms 
				 * the output to GeoJSON
				 */
			};

		} ]);