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

var parseTag = function (tokens, src, cbFn) {
	var start = src.search(/\<(\/)?\w+/g);
	var end = src.substr(Math.min(start, 0)).search(/\>/g);
	if (start == -1 || end == -1) return false;
	var tag = src.substr(start, end - start + 1);
	var tagName = src.substr(start).match(/\<(\/)?\w+/)[0].substr(1);
	var argStart = start + tagName.length + 1;
	var tokenArgsString = src.substr(argStart, end - argStart).trim();
	var tokenArgs = tokenArgsString != '' ? tokenArgsString.split('" ') : [];
	var attributes = parseAttributes(tokenArgs);
	var token = tokens[tagName];
	if (!token) {
		throw new Error(util.format('Tried to parse unknown token: %s', tagName));
	}
	var obj = {
		start: start,
		tag: tag,
		token: token,
		attributes: attributes
	};
	cbFn(obj);
	return obj;
};

// object Token
var Token = function (name) {
	this.name = name;
	this.parser = function () {};
	this.parser.args = [];
	this.renderer = function () {};
	this.renderer.args = [];
};
Token.prototype.addFunction = function (kind, fn) {
	this[kind] = parseFunction(fn);
};

// object Ebookr
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
	while(function () {
		var tag = parseTag(this.tokens, src, function(t) {
			t.token.parser.apply(this, orderArgs(t.attributes, t.token.parser.args));
		});
		if (!tag) return false;
		src = src.substr(tag.start + tag.tag.length);
		return true;
	}.call(this));
};
Ebookr.prototype.render = function (src) {
	var renderedText = src;
	while(function () {
		var tag = parseTag(this.tokens, src, function () {
		});
		if (!tag) return false;
		var search = new RegExp(tag.tag, 'g');
		var replace = tag.token.renderer.apply(this, orderArgs(tag.attributes, tag.token.renderer.args));
		renderedText = renderedText.replace(search, replace);
		src = src.substr(tag.start + tag.tag.length);
		return true;
	}.call(this));
	return renderedText;		
};

// var loadEbookr = function () {
// 	var bkr = q.defer();
// 	require('child_process').exec('npm ls --json', function (err, stdout, stderr) {
// 		var moduleTree = JSON.parse(stdout);
// 		var modules = Object.keys(moduleTree).reduce(function (list, currentValue) {
// 			if (currentValue.substr(0, 7) == 'ebookr-') {
// 				list.push(currentValue);
// 			}
// 			return list;
// 		}, []);
// 		bkr.resolve(new Ebookr(modules));
// 	});
// 	return bkr.promise;
// };

module.exports = new Ebookr();