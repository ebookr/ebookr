var shell = require('shelljs'),
		util = require('util'),
		q = require('q');

module.exports.convert = function (srcFile, options) {
	options = options || {};
	var args = [];
	if (options.output) {
		args.push(util.format('-o %s', options.output));
	}
	if (options.to) {
		args.push(util.format('-t %s', options.to));
	}
	var cmd = util.format('pandoc %s %s', srcFile, args.join(' '));
	var defer = q.defer();
	shell.exec(cmd, function (code, output) {
		defer.resolve(output);
	});
	return defer.promise;
};