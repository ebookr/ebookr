var extend = require('extend'),
		util = require('util'),
		token = require('./token'),
		shell = require('shelljs'),
		fs = require('fs'),
		randomstring = require('randomstring');

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
	var closerTag = util.format('/%s', tagName);
	if (tokens[closerTag]) {
		var closerStart = src.substr(end + closerLength).search(new RegExp(util.format('</%s>', tagName)));
		var unbalancedTag = src.substr(end + closerLength).search(new RegExp(util.format('<%s', tagName)))
		if (unbalancedTag != -1 && unbalancedTag < closerStart) {
			throw new Error(util.format('Unbalanced tags found: %s', tagName));
		}
		if (closerStart != -1) {
			attributes.text = src.substr(end + closerLength, closerStart);
		}
	}
	token.parse(orderArgs(attributes, token.parser.args))
	return {
		start: start,
		tag: tag,
		token: token
	};
};

var formatMap = {
	'html': 'html5'
};

// object Ebookr
var Ebookr = function () {
	this.options = {
		'documentclass': 'book',
		'encoding': 'utf-8',
		'format': 'html'
	};
	this.tokens = {};
	this.tags = [];
};
Ebookr.prototype.addParser = function (tokenName, fn) {
	this.tokens[tokenName] = this.tokens[tokenName] || new token.Token(tokenName);
	this.tokens[tokenName].addParser(fn);
};
Ebookr.prototype.addParsers = function (parsers) {
	Object.keys(parsers).forEach(function (tokenName) {
		this.tokens[tokenName] = this.tokens[tokenName] || new token.Token(tokenName);
		this.tokens[tokenName].addParser(parsers[tokenName]);
	}.bind(this));
};
Ebookr.prototype.addRenderer = function (tokenName, fn) {
	this.tokens[tokenName] = this.tokens[tokenName] || new token.Token(tokenName);
	this.tokens[tokenName].addRenderer(fn);
};
Ebookr.prototype.addRenderers = function (renderers) {
	Object.keys(renderers).forEach(function (tokenName) {
		this.tokens[tokenName] = this.tokens[tokenName] || new token.Token(tokenName);
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
Ebookr.prototype.convert = function (srcFile, outFile) {
	var self = this;
	var data = fs.readFileSync(srcFile, this.options.encoding);
	var tmpFileName = randomstring.generate() + '.md';
	var renderedText = self.parse(data).render();
	fs.writeFileSync(tmpFileName, renderedText);
	var options = [];
	if (outFile) {
		options.push(util.format('-o %s', outFile));
	} else {
		options.push(util.format('-t %s', formatMap[self.options.format]));
	}
	var cmd = util.format('pandoc %s %s', tmpFileName, options.join(' '));
	shell.exec(cmd);
	fs.unlinkSync(tmpFileName);
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