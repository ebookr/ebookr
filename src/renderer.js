var extend = require('extend');
var renderer;

module.exports = function () {
	var Renderer = function () {
		this.tokens = {};
	};
	Renderer.prototype.addToken = function (token, fn) {
		this.tokens[token] = fn;
	};
	Renderer.prototype.addTokens = function (tokens) {
		extend(this.tokens, tokens);
	};

	renderer = renderer || new Renderer();
	return renderer;
};