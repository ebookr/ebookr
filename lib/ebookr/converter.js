var fs = require('fs'),
		randomstring = require('randomstring'),
		shell = require('shelljs'),
		util = require('util'),
		q = require('q');

var formatMap = {
	'html': 'html5'
};

var convert = function (src, outFile) {
	var defer = q.defer();
	var tmpFileName = randomstring.generate() + '.md';
	var renderedText = this.parse(src).render();
	fs.writeFileSync(tmpFileName, renderedText);
	var options = [];
	if (outFile) {
		options.push(util.format('-o %s', outFile));
	} else {
		options.push(util.format('-t %s', formatMap[this.options.format]));
	}
	var cmd = util.format('pandoc %s %s', tmpFileName, options.join(' '));
	shell.exec(cmd, function (code, output) {
		defer.resolve(output);
	});
	fs.unlinkSync(tmpFileName);
	return defer.promise;
};

module.exports.convert = function (src) {
	return convert.call(this, src);
};

module.exports.convertFile = function (srcFile, outFile) {
	var data = fs.readFileSync(srcFile, this.options.encoding);
	return convert.call(this, data, outFile);
};