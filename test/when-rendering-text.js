var expect = require('chai').expect;

describe('When rendering text', function () {
	var ebookr;

	beforeEach(function () {
		ebookr = require('../lib/ebookr').new();
		ebookr.addParser('foo', function (one, two) {
			return [one, two];
		});
		ebookr.addParser('/foo', function () {});
	});

	it('should render tokens', function () {
		ebookr.addRenderer('foo', function () {
			return "test";
		});
		expect(ebookr.parse('foo <foo> bar <foo >baz').render()).to.equal('foo test bar testbaz');
	});

	it('should parse attributes', function () {
		ebookr.addRenderer('foo', function (one, two) {
			return one + two;
		});
		expect(ebookr.parse('foo <foo two="42" one="1337 test"> bar').render()).to.equal('foo 1337 test42 bar');
		expect(ebookr.parse('foo <foo two="42"> bar').render()).to.equal('foo undefined42 bar');
	});

	it('should parse open tags', function () {
		ebookr.addRenderer('foo', function () {
			return '{';
		});
		ebookr.addRenderer('/foo', function () {
			return '}';
		})
		expect(ebookr.parse('foo <foo>test</foo> bar').render()).to.equal('foo {test} bar');
	});

	it('should parse (fake) tags', function () {
		ebookr.addRenderer('foo', function () {
			return 'test';
		});
		expect(ebookr.parse('foo <foo /> bar').render()).to.equal('foo test bar');
	});
});