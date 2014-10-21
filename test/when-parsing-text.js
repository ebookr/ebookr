var expect = require('chai').expect,
		parser = require('../src/parser');

describe('When parsing text', function () {
	var prsr, counter;

	beforeEach(function () {
		prsr = parser();
	});

	afterEach(function () {
		prsr.clear();
	});

	it('should trigger token when found', function () {
		counter = 0;
		prsr.addToken('foo', function () {
			counter++;
		});
		prsr.parse('foo <ebookr:foo> bar <ebookr:foo >');
		expect(counter).to.equal(2);
	});

	it('should trigger exception when unknown token found', function () {
		expect(function () {
			prsr.parse('foo <ebookr:foo> bar');
		}).to.throw(Error);
	});

	it('should parse attributes', function () {
		var foo, bar;
		prsr.addToken('foo', function (one, two) {
			foo = one;
			bar = two;
		});
		prsr.parse('foo <ebookr:foo two="42" one="1337 test"> bar');
		expect(foo).to.equal('1337 test');
		expect(bar).to.equal('42');
		prsr.parse('foo <ebookr:foo one="1337 test"> bar');
		expect(bar).to.be.undefined;
	});
});