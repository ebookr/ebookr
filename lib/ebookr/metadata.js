var extend = require('extend'),
		fs = require('fs'),
		yaml = require('js-yaml');

// helper functions
var Metadata = function (original) {
	this.m = original;
	this.unchanged = extend({}, original);
};
Metadata.prototype.extend = function (obj) {
	for (var key in obj) {
		this.set(key, obj[key]);
	}
};
Metadata.prototype.get = function (key) {
	return key ? this.m[key] : this.m;
};
Metadata.prototype.getChanged = function () {
	var changed = extend({}, this.m);
	Object.keys(this.unchanged).forEach(function (key) {
		delete changed[key];
	});
	return changed;
};
Metadata.prototype.set = function (key, value) {
	this.m[key] = value;
	if (this.unchanged[key] && this.unchanged[key] != value) {
		delete this.unchanged[key];
	}
};

module.exports.new = function (original) {
	return new Metadata(original || {});
};
module.exports.loadYAML = function (filePath) {
	return new Metadata(yaml.safeLoad(fs.readFileSync(filePath, 'utf-8')));
};