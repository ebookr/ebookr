var extend = require('extend');

var converter = require('./ebookr/converter'),
		extensions = require('./ebookr/extensions'),
		parser = require('./ebookr/parser'),
		renderer = require('./ebookr/renderer'),
		console = require('./util/console');

var ebookr = require('../package.json');

// object Ebookr
var Ebookr = function () {
	this.options = require('./ebookr/options');
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
	var commands = require('./ebookr/cli');
	if (commands.version) {
		console.log('ebookr v' + this.version());
		return;
	}
	if (commands.files.length > 0) {
		this.convertFile(commands.files, commands.output || null);
	} else {
		throw new Error('No file(s) given');
	}
};
Ebookr.prototype.config = function (config) {
	extend(this.options, config);
};
Ebookr.prototype.convert = converter.convert;
Ebookr.prototype.convertFile = converter.convertFile;
Ebookr.prototype.loadExtensions = extensions.loadExtensions;
Ebookr.prototype.new = function () {
	return new Ebookr();
};
Ebookr.prototype.pandoc = require('./ebookr/pandoc');
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