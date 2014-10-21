var extend = require('extend'),
		util = require('util');
var parser;

module.exports = function () {
	var orderArgs = function (attributes, fnArgs) {
		return fnArgs.map(function (key) {
			return attributes[key];
		});
	};
	var parseSignatur = function (src) {
		var start = src.search(/\(/g) + 1;
		var end = src.search(/\)/g);
		return start == end ? [] : src.substr(start, end - start).split(',').map(function (arg) {
			return arg.trim();
		});
	};
	var parseFunction = function (fn) {
		fn.args = parseSignatur(fn.toString());
		return fn;
	};
	var parseAttributes = function (args) {
		var attributes = {};
		args.forEach(function (arg) {
			if (arg === '') return;
			var parts = arg.split('=');
			attributes[parts[0]] = parts[1].replace(/\"/g, '');
		});
		return attributes;
	}

	var Parser = function () {
		this.tokens = {};
	};
	Parser.prototype.addToken = function (token, fn) {
		this.tokens[token] = parseFunction(fn);
	};
	Parser.prototype.addTokens = function (tokens) {
		Object.keys(tokens).forEach(function (key) {
			this.tokens[key] = parseFunction (tokens[key]);
		}.bind(this));
	};
	Parser.prototype.clear = function () {
		this.tokens = {};
	};
	Parser.prototype.parse = function (src) {
		var parse = function (parser) {
			var start = src.search(/\<ebookr/g);
			var end = src.substr(Math.min(start, 0)).search(/\>/g);
			if (start == -1 || end == -1) return false;
			var tokenName = src.substr(start).match(/\<ebookr:\w+/)[0].substr(8);
			var argStart = start + tokenName.length + 9;
			var tokenArgs = src.substr(argStart, end - argStart).split('" ');
			if (!parser.tokens[tokenName]) {
				throw new Error(util.format('Tried to parse unknown token: <ebookr:%s>', tokenName));
			}
			var attributes = parseAttributes(tokenArgs);
			var args = orderArgs(attributes, parser.tokens[tokenName].args);
			parser.tokens[tokenName].apply(this, args);
			src = src.substr(end + 1);
			return true;
		};
		while(parse(this));
	};

	parser = parser || new Parser();
	return parser;
};