var expect = require('chai').expect;

describe('When parsing text', function () {
	var ebookr;

	beforeEach(function () {
		ebookr = require('../src/ebookr').new();
	});

	it('should trigger token when found', function () {
		var counter = 0;
		ebookr.addParser('foo', function () {
			counter++;
		});
		ebookr.parse('foo <ebookr:foo> bar <ebookr:foo >');
		expect(counter).to.equal(2);
	});

	it('should trigger exception when unknown token found', function () {
		expect(function () {
			ebookr.parse('foo <ebookr:foo> bar');
		}).to.throw(Error);
	});

	it('should parse attributes', function () {
		var foo, bar;
		ebookr.addParser('foo', function (one, two) {
			foo = one;
			bar = two;
		});
		ebookr.parse('foo <ebookr:foo two="42" one="1337 test"> bar');
		expect(foo).to.equal('1337 test');
		expect(bar).to.equal('42');
		ebookr.parse('foo <ebookr:foo one="1337 test"> bar');
		expect(bar).to.be.undefined;
	});
});