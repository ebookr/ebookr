var fs = require('fs'),
		randomstring = require('randomstring'),
		shell = require('shelljs'),
		util = require('util');

var formatMap = {
	'html': 'html5'
};

module.exports.convert = function (srcFile, outFile) {
	var self = this;
	var data = fs.readFileSync(srcFile, this.options.encoding);
	var tmpFileName = randomstring.generate() + '.md';
	var renderedText = self.parse(data).render();
	fs.writeFileSync(tmpFileName, renderedText);
	var options = [];
	if (outFile) {
		options.push(util.format('-o %s', outFile));
	} else {
		options.push(util.format('-t %s', formatMap[self.options.format]));
	}
	var cmd = util.format('pandoc %s %s', tmpFileName, options.join(' '));
	shell.exec(cmd);
	fs.unlinkSync(tmpFileName);
};