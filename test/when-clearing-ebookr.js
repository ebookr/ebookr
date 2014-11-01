var expect = require('chai').expect;

describe('When clearing ebookr', function () {
	it('should reset ebookr', function () {
		ebookr = require('../lib/ebookr');
		ebookr.addParser('foo', function () {});
		ebookr.parse('<foo />');
		ebookr.clear();
		expect(ebookr.tokens).to.be.empty;
		expect(ebookr.tags).to.be.empty;
	});
});