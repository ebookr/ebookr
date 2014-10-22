var extend = require('extend'),
		util = require('util');
var ebookr;

module.exports = function () {
	// private functions
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

	// object Token
	var Token = function (name) {
		this.name = name;
		this.parser = function () {},
		this.renderer = function () {}
	};
	Token.prototype.addFunction = function (kind, fn) {
		this[kind] = parseFunction(fn);
	};

	var Ebookr = function () {
		this.tokens = {};
	};
	Ebookr.prototype.addParser = function (tokenName, fn) {
		this.tokens[tokenName] = this.tokens[tokenName] || new Token(tokenName);
		this.tokens[tokenName].addFunction('parser', fn);
	};
	Ebookr.prototype.addParsers = function (parsers) {
		Object.keys(parsers).forEach(function (tokenName) {
			this.tokens[tokenName] = this.tokens[tokenName] || new Token(tokenName);
			this.tokens[tokenName].addFunction('parser', parsers[tokenName]);
		}.bind(this));
	};
	Ebookr.prototype.addRenderer = function (tokenName, fn) {
		this.tokens[tokenName] = this.tokens[tokenName] || new Token(tokenName);
		this.tokens[tokenName].addFunction('renderer', fn);
	};
	Ebookr.prototype.addRenderers = function (renderers) {
		Object.keys(renderers).forEach(function (tokenName) {
			this.tokens[tokenName] = this.tokens[tokenName] || new Token(tokenName);
			this.tokens[tokenName].addFunction('renderer', renderers[tokenName]);
		}.bind(this));
	};
	Ebookr.prototype.clear = function () {
		this.tokens = {};
	};
	Ebookr.prototype.parse = function (src) {
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
		var parse = function () {
			var start = src.search(/\<ebookr/g);
			var end = src.substr(Math.min(start, 0)).search(/\>/g);
			if (start == -1 || end == -1) return false;
			var tokenName = src.substr(start).match(/\<ebookr:\w+/)[0].substr(8);
			var argStart = start + tokenName.length + 9;
			var tokenArgs = src.substr(argStart, end - argStart).split('" ');
			var attributes = parseAttributes(tokenArgs);
			var token = this.tokens[tokenName];
			var parser = token.parser;
			if (!token) {
				throw new Error(util.format('Tried to parse unknown token: <ebookr:%s>', tokenName));
			}
			var args = orderArgs(attributes, parser.args);
			parser.apply(this, args);
			src = src.substr(end + 1);
			return true;
		};
		while(parse.call(this));
	};

	ebookr = ebookr || new Ebookr();
	return ebookr;
};