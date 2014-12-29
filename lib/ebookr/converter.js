var fs = require('fs'),
		randomstring = require('randomstring'),
		util = require('util'),
		q = require('q');

var pandoc = require('./pandoc');

var formatMap = {
	'html': 'html5'
};

var convert = function (src, options) {
	var tmpFileName = randomstring.generate() + '.md';
	var renderedText = this.parse(src).render();
	fs.writeFileSync(tmpFileName, renderedText);
	options = options || {};
	if (!options.output) {
		options.to = formatMap[this.options.format];
	}
	var promise = pandoc.convert(tmpFileName, options).then(function () {
		fs.unlinkSync(tmpFileName);
	})
	return promise;
};

module.exports.convert = function (src, options) {
	return convert.call(this, src, options);
};

module.exports.convertFile = function (srcFiles, options) {
	var data = srcFiles.map(function (srcFile) {
		return fs.readFileSync(srcFile, this.options.encoding);
	}.bind(this)).join('\n\n');
	return convert.call(this, data, options);
};