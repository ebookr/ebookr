var Tag = function (start, tag, token, parsed) {
	this.start = start;
	this.tag = tag;
	this.token = token;
	this.parsed = parsed;
};
Tag.prototype.render = function () {
	return this.token.render.apply(this.token, this.parsed);
};

module.exports.new = function (start, tag, token, parsed) {
	return new Tag(start, tag, token, parsed);
};