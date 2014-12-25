var util = require('util');

module.exports.loadExtensions = function (extensions) {
	if(util.isArray(extensions)) {
		extensions.forEach(function (extension) {
			require(extension)();
		});
	} else {
		Object.keys(extensions).forEach(function (extension) {
			require(extension)(extensions[extension]);
		});
	}
};