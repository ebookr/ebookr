var extend = require('extend'),
		util = require('util'),
		q = require('q');

// helper functions
var orderArgs = function (attributes, fnArgs) {
	return fnArgs.map(function (key) {
		return attributes[key];
	});
};

var parseAttributes = function (args) {
	var attributes = {};
	args.forEach(function (arg) {
		if (arg === '') return;
		var parts = arg.split('=');
		attributes[parts[0]] = parts[1].replace(/\"/g, '');
	});
	return attributes;
};

var parseFunction = function (fn) {
	fn.args = parseSignatur(fn.toString());
	return fn;
};

var parseSignatur = function (src) {
	var start = src.search(/\(/g) + 1;
	var end = src.search(/\)/g);
	return start == end ? [] : src.substr(start, end - start).split(',').map(function (arg) {
		return arg.trim();
	});
};

var parseTag = function (tokens, src) {
	var start = src.search(/\<(\/)?\w+/g);
	var end = src.substr(Math.min(start, 0)).search(/(\/)?\>/g);
	if (start == -1 || end == -1) return false;
	var closerLength = src.substr(end, 1) == '/' ? 2 : 1;
	var tag = src.substr(start, end - start + closerLength);
	var tagName = src.substr(start).match(/\<(\/)?\w+/)[0].substr(1);
	var token = tokens[tagName];
	if (!token) {
		console.warn(util.format('Tried to parse unknown token: %s', tagName));
		return {
			start: start,
			tag: tag,
			token: null
		};
	}
	var argStart = start + tagName.length + 1;
	var tokenArgsString = src.substr(argStart, end - argStart).trim();
	var tokenArgs = tokenArgsString != '' ? tokenArgsString.split('" ') : [];
	var attributes = parseAttributes(tokenArgs);
	token.parse(orderArgs(attributes, token.parser.args))
	return {
		start: start,
		tag: tag,
		token: token
	};
};

// object Token
var Token = function (name) {
	this.name = name;
	this.parser = function () {};
	this.parser.args = [];
	this.renderer = function () {};
};
Token.prototype.addParser = function (fn) {
	this.parser = parseFunction(fn);
};
Token.prototype.addRenderer = function (fn) {
	this.renderer = fn;
};
Token.prototype.parse = function (args) {
	this.parsed = this.parser.apply(this, args);
};
Token.prototype.render = function () {
	return this.renderer.apply(this, this.parsed);
};

// object Ebookr
var Ebookr = function () {
	this.options = {
		'documentclass': 'book'
	};
	this.tokens = {};
	this.tags = [];
};
Ebookr.prototype.addParser = function (tokenName, fn) {
	this.tokens[tokenName] = this.tokens[tokenName] || new Token(tokenName);
	this.tokens[tokenName].addParser(fn);
};
Ebookr.prototype.addParsers = function (parsers) {
	Object.keys(parsers).forEach(function (tokenName) {
		this.tokens[tokenName] = this.tokens[tokenName] || new Token(tokenName);
		this.tokens[tokenName].addParser(parsers[tokenName]);
	}.bind(this));
};
Ebookr.prototype.addRenderer = function (tokenName, fn) {
	this.tokens[tokenName] = this.tokens[tokenName] || new Token(tokenName);
	this.tokens[tokenName].addRenderer(fn);
};
Ebookr.prototype.addRenderers = function (renderers) {
	Object.keys(renderers).forEach(function (tokenName) {
		this.tokens[tokenName] = this.tokens[tokenName] || new Token(tokenName);
		this.tokens[tokenName].addRenderer(renderers[tokenName]);
	}.bind(this));
};
Ebookr.prototype.clear = function () {
	this.tags = [];
	this.tokens = {};
};
Ebookr.prototype.config = function (config) {
	extend(this.options, config);
};
Ebookr.prototype.loadExtensions = function (extensions) {
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
Ebookr.prototype.new = function () {
	return new Ebookr();
};
Ebookr.prototype.parse = function (src) {
	this.text = src;
	while(function () {
		var tag = parseTag(this.tokens, src);
		if (!tag) return false;
		if (tag.token) {
			this.tags.push(tag);
		}
		src = src.substr(tag.start + tag.tag.length);
		return true;
	}.call(this));
	return this;
};
Ebookr.prototype.render = function () {
	var src = this.text;
	this.tags.forEach(function (tag) {
		src = src.replace(new RegExp(tag.tag), tag.token.render());
	});
	return src;
};

module.exports = new Ebookr();