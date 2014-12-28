var randomstring = require('randomstring'),
		shell = require('shelljs'),
		util = require('util'),
		q = require('q');

module.exports.convert = function (srcFile, options) {
	options = options || {};
	var args = [];
	var format;
	var mobiFileName;
	if (options.to) {
		format = options.to;
		args.push(util.format('-t %s', options.to));
	}
	if (options.output) {
		var fileNameParts = options.output.split('.');
		format = format || fileNameParts.pop();
		tmpEpubName = util.format('%s.epub', fileNameParts.join('.'));
		options.output = format == 'mobi' ? tmpEpubName : options.output;
		args.push(util.format('-o %s', options.output));
	}
	var defer = q.defer();
	shell.exec(util.format('pandoc %s %s', srcFile, args.join(' ')), { async: false }, function (code, output) {
		defer.resolve(output);
	});
	if (format == 'mobi') {
		shell.exec(util.format('kindlegen %s', tmpEpubName));
	}
	return defer.promise;
};