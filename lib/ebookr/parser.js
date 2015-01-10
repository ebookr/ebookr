var util = require('util');

var tag = require('./tag'),
		token = require('./token'),
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
	var start = src.search(/\<\w+/g);
	var end = src.substr(Math.min(start, 0)).search(/(\/)?\>/g);
	if (start > end) {
		end = src.substr(start).search(/(\/)?\>/g) + start;
	}
	if (start == -1 || end == -1) return false;
	var closerLength = src.substr(end, 1) == '/' ? 2 : 1;
	var tagInst = src.substr(start, end - start + closerLength);
	var tagName = src.substr(start).match(/\<(\/)?\w+/)[0].substr(1);
	var token = tokens[tagName];
	if (!token) {
		console.warn(util.format('Tried to parse unknown token: %s', tagName));
		return tag.new(start, tagInst);
	}
	var argStart = start + tagName.length + 1;
	var tokenArgsString = src.substr(argStart, end - argStart).trim();
	var tokenArgs = tokenArgsString != '' ? tokenArgsString.split('" ') : [];
	var attributes = parseAttributes(tokenArgs);
	var closerStart = src.substr(end + closerLength).search(new RegExp(util.format('</%s>', tagName)));
	var startTag = tagInst;
	if (closerStart !== -1) {
		var unbalancedTag = src.substr(end + closerLength).search(new RegExp(util.format('<%s', tagName)))
		if (unbalancedTag != -1 && unbalancedTag < closerStart) {
			throw new Error(util.format('Unbalanced tags found: %s', tagName));
		}
		attributes.text = closerStart != -1 ? src.substr(end + closerLength, closerStart) : null;
		tagInst += util.format('%s</%s>', attributes.text, tagName);
	}
	var parsed = token.parse(orderArgs(attributes, token.args));
	return tag.new(start, startTag, tagInst, token, parsed, attributes.text);
};

module.exports.addParser = function (tokenName, fn) {
	this.tokens[tokenName] = this.tokens[tokenName] || token.new(tokenName);
	this.tokens[tokenName].addParser(fn);
};
module.exports.addParsers = function (parsers) {
	Object.keys(parsers).forEach(function (tokenName) {
		this.tokens[tokenName] = this.tokens[tokenName] || token.new(tokenName);
		this.tokens[tokenName].addParser(parsers[tokenName]);
	}.bind(this));
};
module.exports.parse = function (src) {
	this.text = src;
	while(function () {
		var t = parseTag(this.tokens, src);
		if (!t) return false;
		if (t.token) {
			this.tags.push(t);
		}
		src = src.substr(t.start + t.startTag.length);
		return true;
	}.call(this));
	return this;
};