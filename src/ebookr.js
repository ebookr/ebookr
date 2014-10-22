var extend = require('extend'),
		util = require('util'),
		q = require('q');
var ebookr;

module.exports = function () {
	// private functions
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
		var start = src.search(/\<ebookr/g);
		var end = src.substr(Math.min(start, 0)).search(/\>/g);
		if (start == -1 || end == -1) return false;
		var tokenName = src.substr(start).match(/\<ebookr:\w+/)[0].substr(8);
		var argStart = start + tokenName.length + 9;
		var tokenArgs = src.substr(argStart, end - argStart).split('" ');
		var attributes = parseAttributes(tokenArgs);
		var token = tokens[tokenName];
		if (!token) {
			throw new Error(util.format('Tried to parse unknown token: <ebookr:%s>', tokenName));
		}
		return {
			start: start,
			end: end,
			string: src.substr(start, end - start + 1),
			token: token,
			attributes: attributes
		};
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

	// object Ebookr
	var Ebookr = function (modules) {
		this.tokens = {};
		modules.forEach(function (module) {
			require(module)();
		});
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
		var parse = function () {
			var tag = parseTag(this.tokens, src);
			if (!tag) return false;
			tag.token.parser.apply(this, orderArgs(tag.attributes, tag.token.parser.args));
			src = src.substr(tag.end + 1);
			return true;
		};
		while(parse.call(this));
	};
	Ebookr.prototype.render = function (src) {
		var renderedText = src;
		var render = function () {
			var tag = parseTag(this.tokens, src);
			if (!tag) return false;
			renderedText = renderedText.replace(tag.string, function () {
				return tag.token.renderer.apply(this, orderArgs(tag.attributes, tag.token.renderer.args));
			}, 'g');
			src = src.substr(tag.end + 1);
			return true;
		};
		while(render.call(this));
		return renderedText;		
	};

	var loadEbookr = function () {
		var bkr = q.defer();
		require('child_process').exec('npm ls --json', function (err, stdout, stderr) {
			var moduleTree = JSON.parse(stdout);
			var modules = Object.keys(moduleTree).reduce(function (list, currentValue) {
				if (currentValue.substr(0, 7) == 'ebookr-') {
					list.push(currentValue);
				}
				return list;
			}, []);
			bkr.resolve(new Ebookr(modules));
		});
		return bkr.promise;
	};

	ebookr = ebookr || loadEbookr();
	return ebookr;
};