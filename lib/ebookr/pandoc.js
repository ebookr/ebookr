var fs = require('fs'),
		randomstring = require('randomstring'),
		shell = require('shelljs'),
		util = require('util'),
		q = require('q'),
		yaml = require('js-yaml');

var ebookr = require('../ebookr');

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
	var metadata = ebookr.metadata();
	if (options.metadata) {
		var metadataFromFile = yaml.safeLoad(fs.readFileSync(options.metadata, 'utf-8'));
		Object.keys(metadataFromFile).forEach(function (key) {
			if (metadata[key] && metadataFromFile[key] == metadata[key]) {
				delete metadata[key];
			}
		});
		files.unshift(options.metadata);
	}
	Object.keys(metadata).forEach(function (key) {
		if (metadata[key] !== true) {
			args.push(util.format('-m %s=%s', key, metadata[key]));
		} else {
			args.push(util.format('-m %s', key));
		}
	});
	var defer = q.defer();
	var pandocCmd = util.format('pandoc %s', files.concat(args).join(' '));
	if (options.verbose) {
		console.log(util.format('Executing "%s"', pandocCmd));
	}
	shell.exec(pandocCmd, function (code, output) {
		if (format == 'mobi') {
			var kindlegenCmd = util.format('kindlegen %s', tmpEpubName);
			if (options.verbose) {
				console.log(util.format('Executing "%s"', kindlegenCmd));
			}
			shell.exec(kindlegenCmd, function () {
				defer.resolve(output);
			});
		} else {
			defer.resolve(output);
		}
	});
	return defer.promise;
};