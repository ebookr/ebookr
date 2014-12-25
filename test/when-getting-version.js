var expect = require('chai').expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon');

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
		it('should log version', function () {
			sinon.spy(console, 'log');
			var ebookr = mockrequire('../lib/ebookr', {
				'extend': require('extend'),
				'./cli': {
					'version': true
				}
			});
			expect(console.log.calledOnce);
		})
	});
});