var expect = require('chai').expect;

describe('When rendering text', function () {
	var ebookr;

	beforeEach(function () {
		ebookr = require('../src/ebookr').new();
	});

	it('should trigger token when found', function () {
		ebookr.addRenderer('foo', function () {
			return "test";
		});
		var renderedText = ebookr.render('foo <ebookr:foo> bar <ebookr:foo >baz');
		expect(renderedText).to.equal('foo test bar testbaz');
	});

	it('should trigger exception when unknown token found', function () {
		expect(function () {
			ebookr.render('foo <ebookr:foo> bar');
		}).to.throw(Error);
	});

	it('should parse attributes', function () {
		ebookr.addRenderer('foo', function (one, two) {
			return one + two;
		});
		expect(ebookr.render('foo <ebookr:foo two="42" one="1337 test"> bar')).to.equal('foo 1337 test42 bar');
		expect(ebookr.render('foo <ebookr:foo two="42"> bar')).to.equal('foo undefined42 bar');
	});
});