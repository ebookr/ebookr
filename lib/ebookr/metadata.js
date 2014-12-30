var extend = require('extend');

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
};

module.exports = function (keyOrObject, valueOrKeepValue, shouldKeepValue) {
	this.m = this.m || {};
	var isKey = typeof(keyOrObject) == "string";
	if (!isKey) {
		extendMetadata.call(this, keyOrObject, valueOrKeepValue);
	} else if (valueOrKeepValue) {
		set.call(this, keyOrObject, valueOrKeepValue, shouldKeepValue);
	}
	if (isKey && !valueOrKeepValue) {
		return get.call(this, keyOrObject);
	}
};