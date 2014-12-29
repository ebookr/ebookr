var randomstring = require('randomstring'),
		shell = require('shelljs'),
		util = require('util'),
		q = require('q');

module.exports.convert = function (src, options) {
	options = options || {};
	var args = [];
	var format;
	var mobiFileName;
	var files = util.isArray(src) ? src : [src];
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
	if (options.metadata) {
		files.push(options.metadata);
	}
	var defer = q.defer();
	shell.exec(util.format('pandoc %s', files.concat(args).join(' ')), function (code, output) {
		if (format == 'mobi') {
			shell.exec(util.format('kindlegen %s', tmpEpubName), function () {
				defer.resolve(output);
			});
		} else {
			defer.resolve(output);
		}
	});
	return defer.promise;
};