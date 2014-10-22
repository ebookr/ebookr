var expect = require('chai').expect,
		ebookr = require('../src/ebookr');

describe('When parsing text', function () {
	var bkr;

	beforeEach(function (done) {
		ebookr().then(function (inst) {
			bkr = inst;
			done();
		});
	});

	afterEach(function () {
		bkr.clear();
	});

	it('should trigger token when found', function () {
		var counter = 0;
		bkr.addParser('foo', function () {
			counter++;
		});
		bkr.parse('foo <ebookr:foo> bar <ebookr:foo >');
		expect(counter).to.equal(2);
	});

	it('should trigger exception when unknown token found', function () {
		expect(function () {
			bkr.parse('foo <ebookr:foo> bar');
		}).to.throw(Error);
	});

	it('should parse attributes', function () {
		var foo, bar;
		bkr.addParser('foo', function (one, two) {
			foo = one;
			bar = two;
		});
		bkr.parse('foo <ebookr:foo two="42" one="1337 test"> bar');
		expect(foo).to.equal('1337 test');
		expect(bar).to.equal('42');
		bkr.parse('foo <ebookr:foo one="1337 test"> bar');
		expect(bar).to.be.undefined;
	});
});