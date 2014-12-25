var util = require('util');

var token = require('./token'),
		console = require('../util/console');

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

module.exports.addParser = function (tokenName, fn) {
	this.tokens[tokenName] = this.tokens[tokenName] || new token.Token(tokenName);
	this.tokens[tokenName].addParser(fn);
};
module.exports.addParsers = function (parsers) {
	Object.keys(parsers).forEach(function (tokenName) {
		this.tokens[tokenName] = this.tokens[tokenName] || new token.Token(tokenName);
		this.tokens[tokenName].addParser(parsers[tokenName]);
	}.bind(this));
};
module.exports.parse = function (src) {
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