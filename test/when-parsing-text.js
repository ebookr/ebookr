var expect = require('chai').expect,
		sinon = require('sinon');

describe('When parsing text', function () {
	var ebookr;

	beforeEach(function () {
		ebookr = require('../lib/ebookr').new();
	});

	it('should trigger token when found', function () {
		var spy = sinon.spy();
		ebookr.addParser('foo', spy);
		ebookr.parse('foo <foo> bar <foo >');
		expect(spy.calledTwice).to.be.true;
	});

	it('should trigger exception when unknown token found', function () {
		expect(function () {
			ebookr.parse('foo <foo> bar');
		}).to.throw(Error);
	});

	it('should parse attributes', function () {
		var foo, bar;
		ebookr.addParser('foo', function (one, two) {
			foo = one;
			bar = two;
		});
		ebookr.parse('foo <foo two="42" one="1337 test"> bar');
		expect(foo).to.equal('1337 test');
		expect(bar).to.equal('42');
		ebookr.parse('foo <foo one="1337 test"> bar');
		expect(foo).to.equal('1337 test');
		expect(bar).to.be.undefined;
	});

	it('should parse (fake) tags', function () {
		var spy = sinon.spy();
		ebookr.addParser('/foo', spy);
		ebookr.parse('foo </foo> bar');
		expect(spy.calledOnce).to.be.true;
	});
});