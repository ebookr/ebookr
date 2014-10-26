var expect = require('chai').expect;

describe('When configuring ebookr', function () {
	var ebookr;

	beforeEach(function () {
		ebookr = require('../lib/ebookr').new();
	});

	it('should have default configurations', function () {
		expect(ebookr.options).to.eql({
			documentclass: 'book'
		});
	});

	it('should expose configurations', function () {
		ebookr.config({ documentclass: 'article' });
		expect(ebookr.options.documentclass).to.equal('article');
	});
});