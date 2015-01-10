var Token = require('./token'),
		util = require('util');

module.exports.addRenderer = function (tokenName, fn, end) {
	this.tokens[tokenName] = this.tokens[tokenName] || Token.new(tokenName);
	this.tokens[tokenName].addRenderer(fn, end);
};
module.exports.addRenderers = function (renderers) {
	Object.keys(renderers).forEach(function (tokenName) {
		var token = this.tokens[tokenName] = this.tokens[tokenName] || Token.new(tokenName);
		var renderer = renderers[tokenName];
		if (util.isArray(renderer)) {
			token.addRenderer.apply(token, renderer);
		} else {
			token.addRenderer(renderer);
		}
	}.bind(this));
};