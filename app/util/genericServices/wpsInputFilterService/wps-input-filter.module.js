angular.module('wpsInputFilter', []);

/**
 * provides methods to filter input lists for their type (literalData,
 * complexData, boundingBoxData)
 */
angular.module('wpsInputFilter').service('wpsInputFilterService', function() {

	this.hasLiteralData = function(input) {
		if (input.literalData)
			return true;

		return false;
	},

	this.hasComplexData = function(input) {
		if (input.complexData)
			return true;

		return false;
	},

	this.hasBoundingBoxData = function(input) {
		if (input.boundingBoxData)
			return true;

		return false;
	}

});