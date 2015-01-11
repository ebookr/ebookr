var extend = require('extend'),
		util = require('util'),
		q = require('q');

// helper functions
var parseArgs = function (fn) {
	return parseSignatur(fn.toString());
};

var parseSignatur = function (src) {
	var start = src.search(/\(/g) + 1;
	var end = src.search(/\)/g);
	return start == end ? [] : src.substr(start, end - start).split(',').map(function (arg) {
		return arg.trim();
	});
};

// object Token
var Token = function (name) {
	this.name = name;
	this.args = [];
	this.text = null;
	this.parser = function () {};
	this.renderer = function () {};
};
Token.prototype.addParser = function (fn) {
	this.parser = fn;
	this.args = parseArgs(fn);
};
Token.prototype.addRenderer = function (fn) {
	this.renderer = fn;
};
Token.prototype.parse = function (args) {
	return this.parser.apply(this, args);
};
Token.prototype.render = function () {
	return this.renderer.apply(this, arguments);
};
Token.prototype.end = function () {
	return this.end.apply(this, arguments);
};

exports.new = function (name) {
	return new Token(name);
};