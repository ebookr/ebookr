var expect = require('chai').expect,
		ebookr = require('../lib/ebookr'),
		q = require('q');

describe('When instantiating ebookr', function () {
	it('should be an object', function () {
		expect(ebookr).to.be.an('object');
	});

	it('can create a new (for testing purposes)', function () {
		ebookr.addParser('test', function() {});
		expect(ebookr.new().tokens).to.be.empty;
	});

	it('should set metadata', function () {
		expect(ebookr.metadata).to.exist;
	});

	it('should set option', function () {
		expect(ebookr.option).to.exist;
	});
});