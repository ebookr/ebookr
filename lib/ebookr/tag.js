var util = require('util');

var Tag = function (start, startTag, tag, token, parsed, text) {
	this.start = start;
	this.startTag = startTag,
	this.tag = tag;
	this.token = token;
	this.parsed = parsed;
	this.text = text;
};
Tag.prototype.render = function () {
	return this.text
		? util.format.apply(this, [
			'%s%s%s', 
			this.token.render.apply(this.token, this.parsed), 
			this.text, 
			this.token.end.apply(this.token, this.parsed)
		])
		: this.token.render.apply(this.token, this.parsed);
};

module.exports.new = function (start, startTag, tag, token, parsed, text) {
	return new Tag(start, startTag, tag, token, parsed, text);
};