var fs = require('fs'),
		randomstring = require('randomstring'),
		util = require('util'),
		q = require('q');

var pandoc = require('./pandoc');

var formatMap = {
	'html': 'html5'
};

var convert = function (src, outFile) {
	var tmpFileName = randomstring.generate() + '.md';
	var renderedText = this.parse(src).render();
	fs.writeFileSync(tmpFileName, renderedText);
	var options = {};
	if (outFile) {
		options.output = outFile;
	} else {
		options.to = formatMap[this.options.format];
	}
	var promise = pandoc.convert(tmpFileName, options).then(function () {
		fs.unlinkSync(tmpFileName);
	})
	return promise;
};

module.exports.convert = function (src) {
	return convert.call(this, src);
};

module.exports.convertFile = function (srcFiles, outFile) {
	var data = srcFiles.map(function (srcFile) {
		return fs.readFileSync(srcFile, this.options.encoding);
	}.bind(this)).join('\n\n');
	return convert.call(this, data, outFile);
};