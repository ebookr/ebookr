var token = require('./token');

module.exports.addRenderer = function (tokenName, fn) {
	this.tokens[tokenName] = this.tokens[tokenName] || new token.Token(tokenName);
	this.tokens[tokenName].addRenderer(fn);
};
module.exports.addRenderers = function (renderers) {
	Object.keys(renderers).forEach(function (tokenName) {
		this.tokens[tokenName] = this.tokens[tokenName] || new token.Token(tokenName);
		this.tokens[tokenName].addRenderer(renderers[tokenName]);
	}.bind(this));
};