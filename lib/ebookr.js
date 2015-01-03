var extend = require('extend');

var cli = require('./ebookr/cli'),
		converter = require('./ebookr/converter'),
		extensions = require('./ebookr/extensions'),
		metadata = require('./ebookr/metadata'),
		pandoc = require('./ebookr/pandoc'),
		parser = require('./ebookr/parser'),
		renderer = require('./ebookr/renderer');

var ebookr = require('../package.json');

// object Ebookr
var Ebookr = function () {
	this.options = require('./ebookr/options');
	this.tokens = {};
	this.tags = [];
	this.metadata = metadata.new();
};
Ebookr.prototype.addParser = parser.addParser;
Ebookr.prototype.addParsers = parser.addParsers;
Ebookr.prototype.addRenderer = renderer.addRenderer;
Ebookr.prototype.addRenderers = renderer.addRenderers;
Ebookr.prototype.clear = function () {
	this.tags = [];
	this.tokens = {};
};
Ebookr.prototype.cli = cli.execute;
Ebookr.prototype.config = function (config) {
	extend(this.options, config);
};
Ebookr.prototype.convert = converter.convert;
Ebookr.prototype.convertFile = converter.convertFile;
Ebookr.prototype.loadExtension = function (extensionName) {
	extensions.extend.call(this, 'ebookr-' + extensionName);
};
Ebookr.prototype.loadExtensions = function (extensionNames) {
	extensionNames.forEach(function (extensionName) {
		this.loadExtension(extensionName);
	}.bind(this));
};
Ebookr.prototype.new = function () {
	return new Ebookr();
};
Ebookr.prototype.pandoc = pandoc.convert;
Ebookr.prototype.parse = parser.parse;
Ebookr.prototype.render = function () {
	var src = this.text;
	this.tags.forEach(function (tag) {
		src = src.replace(new RegExp(tag.tag), tag.render());
	});
	return src;
};
Ebookr.prototype.version = function () {
	return ebookr.version;
};

module.exports = new Ebookr();