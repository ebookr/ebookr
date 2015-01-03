var extend = require('extend'),
		fs = require('fs'),
		yaml = require('js-yaml');

// helper functions
var Option = function (options) {
	this.options = options;
};
Option.prototype.extend = function (options) {
	extend(this.options, options)
};
Option.prototype.get = function (key) {
	return key ? this.options[key] : this.options;
};
Option.prototype.set = function (key, value) {
	this.options[key] = value;
};

module.exports.new = function () {
	return new Option({
		'documentclass': 'book',
		'encoding': 'utf-8',
		'format': 'html'
	});
};
