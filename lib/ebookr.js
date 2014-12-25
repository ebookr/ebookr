var extend = require('extend');

var converter = require('./converter'),
		extensions = require('./extensions'),
		parser = require('./parser'),
		renderer = require('./renderer'),
		util = require('./util');

var ebookr = require('../package.json');

// object Ebookr
var Ebookr = function () {
	this.options = require('./options');
	this.tokens = {};
	this.tags = [];
};
Ebookr.prototype.addParser = parser.addParser;
Ebookr.prototype.addParsers = parser.addParsers;
Ebookr.prototype.addRenderer = renderer.addRenderer;
Ebookr.prototype.addRenderers = renderer.addRenderers;
Ebookr.prototype.clear = function () {
	this.tags = [];
	this.tokens = {};
};
Ebookr.prototype.cli = function () {
	var commands = require('./cli');
	if (commands.version) {
		util.log('ebookr v' + this.version());
	}
};
Ebookr.prototype.config = function (config) {
	extend(this.options, config);
};
Ebookr.prototype.convert = converter.convert;
Ebookr.prototype.loadExtensions = extensions.loadExtensions;
Ebookr.prototype.new = function () {
	return new Ebookr();
};
Ebookr.prototype.parse = parser.parse;
Ebookr.prototype.render = function () {
	var src = this.text;
	this.tags.forEach(function (tag) {
		src = src.replace(new RegExp(tag.tag), tag.token.render());
	});
	return src;
};
Ebookr.prototype.version = function () {
	return ebookr.version;
};

module.exports = new Ebookr();