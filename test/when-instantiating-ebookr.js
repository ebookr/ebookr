var expect = require('chai').expect,
		ebookr = require('../src/ebookr'),
		q = require('q');

describe('When instantiating ebookr', function () {
	it('should be an object', function () {
		expect(ebookr).to.be.an('object');
	});

	it('can create a new (for testing purposes)', function () {
		ebookr.addParser('test', function() {});
		expect(ebookr.new().tokens).to.be.empty;
	});
});