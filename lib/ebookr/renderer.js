var token = require('./token'),
		util = require('util');

module.exports.addRenderer = function (tokenName, fn, end) {
	this.tokens[tokenName] = this.tokens[tokenName] || token.new(tokenName);
	this.tokens[tokenName].addRenderer(fn, end);
};
module.exports.addRenderers = function (renderers) {
	Object.keys(renderers).forEach(function (tokenName) {
		this.tokens[tokenName] = this.tokens[tokenName] || token.new(tokenName);
		this.tokens[tokenName].addRenderer(renderers[tokenName]);
	}.bind(this));
};