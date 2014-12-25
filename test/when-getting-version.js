var expect = require('chai').expect;

describe('When getting version', function () {
	it('should fetch version from package', function () {
		var ebookrVersion = require('../lib/ebookr').version();
		var packageVersion = require('../package').version;
		expect(ebookrVersion).to.equal(packageVersion);
	});
});