var util = require('util');

var Tag = function (start, startTag, tag, token, parsed) {
	this.start = start;
	this.startTag = startTag,
	this.tag = tag;
	this.token = token;
	this.parsed = parsed;
};
Tag.prototype.render = function () {
	return this.token.render.apply(this.token, this.parsed);
};

module.exports.new = function (start, startTag, tag, token, parsed) {
	return new Tag(start, startTag, tag, token, parsed);
};