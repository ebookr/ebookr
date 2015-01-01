var extend = require('extend'),
		fs = require('fs'),
		yaml = require('js-yaml');

var extendMetadata = function (obj, shouldKeepValue) {
	if (shouldKeepValue) {
		this.m = extend(obj, this.m);
	} else {
		extend(this.m, obj);
	}
};
var get = function (key) {
	return this.m[key];
};
var set = function (key, value, shouldKeepValue) {
	this.m[key] = shouldKeepValue && this.m[key] !== undefined ? this.m[key] : value;
	if (this.unchanged && this.unchanged[key] && this.unchanged[key] != this.m[key]) {
		delete this.unchanged[key];
	}
};

module.exports = function (keyOrObject, valueOrKeepValue, shouldKeepValue) {
	this.m = this.m || {};
	var isKey = typeof(keyOrObject) == "string";
	if (!keyOrObject) {
		return this.m;
	}
	if (!isKey) {
		extendMetadata.call(this, keyOrObject, valueOrKeepValue);
	} else if (valueOrKeepValue) {
		set.call(this, keyOrObject, valueOrKeepValue, shouldKeepValue);
	}
	if (isKey && !valueOrKeepValue) {
		return get.call(this, keyOrObject);
	}
};
module.exports.loadYAML = function (filePath) {
	var metadata = yaml.safeLoad(fs.readFileSync(filePath, 'utf-8'));
	this.m = extend(this.m || {}, metadata);
	this.unchanged = metadata;
};
module.exports.getChanged = function () {
	var changed = extend({}, this.m);
	if (!this.unchanged) return changed;
	Object.keys(this.unchanged).forEach(function (key) {
		delete changed[key];
	});
	return changed;
};