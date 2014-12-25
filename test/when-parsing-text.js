var expect = require('chai').expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon');

describe('When parsing text', function () {
	var ebookr;
	var noop = function () {};
	var warnSpy;

	beforeEach(function () {
		warnSpy = sinon.spy();
		ebookr = mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./parser': mockrequire('../lib/parser', {
				'util': require('util'),
				'./util': { warn: warnSpy }
			})
		}).new();
	});

	it('should trigger token when found', function () {
		var spy = sinon.spy();
		ebookr.addParser('foo', spy);
		ebookr.parse('foo <foo> bar <foo >');
		expect(spy.calledTwice).to.be.true;
	});

	it('should log warning when unknown token found', function () {
		ebookr.parse('foo <foo> bar');
		expect(warnSpy.calledOnce);
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
		ebookr.addParser('foo', spy);
		ebookr.parse('foo <foo /> bar <foo />');
		expect(spy.calledThrice).to.be.true;
	});

	it('should parse open tags', function () {
		var parsedText;
		ebookr.addParsers({
			'foo': function (text) {
				parsedText = text;
			},
			'/foo': function () {}
		});
		ebookr.parse('<foo>test</foo>');
		expect(parsedText).to.equal('test');
	});

	it('should notify unbalanced tags', function () {
		ebookr.addParsers({
			'foo': noop,
			'/foo': noop
		});
		expect(function () {
			ebookr.parse('<foo><foo></foo>');
		}).to.throw(/Unbalanced tags found/);
	});
});