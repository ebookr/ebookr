var expect = require('chai').expect;

describe('When getting version', function () {
	var packageVersion;

	beforeEach(function () {
		packageVersion = require('../package').version;
	});

	it('should fetch version from package', function () {
		var ebookrVersion = require('../lib/ebookr').version();
		expect(ebookrVersion).to.equal(packageVersion);
	});
});