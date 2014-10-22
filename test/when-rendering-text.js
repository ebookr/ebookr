var expect = require('chai').expect,
		ebookr = require('../src/ebookr');

describe('When rendering text', function () {
	var bkr;

	beforeEach(function (done) {
		ebookr().then(function (instance) {
			bkr = instance;
			done();
		});
	});

	afterEach(function () {
		bkr.clear();
	});

	it('should trigger token when found', function () {
		bkr.addRenderer('foo', function () {
			return "test";
		});
		var renderedText = bkr.render('foo <ebookr:foo> bar <ebookr:foo >baz');
		expect(renderedText).to.equal('foo test bar testbaz');
	});

	it('should trigger exception when unknown token found', function () {
		expect(function () {
			bkr.render('foo <ebookr:foo> bar');
		}).to.throw(Error);
	});

	it('should parse attributes', function () {
		bkr.addRenderer('foo', function (one, two) {
			return one + two;
		});
		expect(bkr.render('foo <ebookr:foo two="42" one="1337 test"> bar')).to.equal('foo 1337 test42 bar');
		expect(bkr.render('foo <ebookr:foo two="42"> bar')).to.equal('foo undefined42 bar');
	});
});