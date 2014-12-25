var expect = require('chai').expect,
		child_process = require('child_process'),
		util = require('util');

describe('When getting version', function () {
	var packageVersion;

	beforeEach(function () {
		packageVersion = require('../package').version;
	});

	it('should fetch version from package', function () {
		var ebookrVersion = require('../lib/ebookr').version();
		expect(ebookrVersion).to.equal(packageVersion);
	});

	describe('With CLI', function () {
		it('should log version', function (done) {
			child_process.exec('node ./lib/ebookr.js --version', function (error, stdout, stderr) {
				expect(stdout).to.equal(util.format('ebookr v%s\n', packageVersion));
				done();
			});
		})
	});
});