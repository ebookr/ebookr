var util = require('util');

module.exports.loadExtensions = function (extensions) {
	if(util.isArray(extensions)) {
		extensions.forEach(function (extension) {
			require(extension)(this);
		}.bind(this));
	} else {
		require(extensions)(this);
	}
};