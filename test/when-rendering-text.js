var expect = require('chai').expect,
		sinon = require('sinon');

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

	it('should drop rendering unknown tokens', function () {
		expect(ebookr.parse('foo <bar> bar').render()).to.equal('foo <bar> bar');
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

	it('should parse similar-named tags', function () {
		ebookr.addRenderers({
			'foo': function () { return 'foo'; },
			'subfoo': function () { return 'subfoo'; }
		});
		expect(ebookr.parse('<foo /> <subfoo />').render()).to.equal('foo subfoo');
	});

	it('should be able to parse text on separate occasions', function () {
		ebookr.addRenderers({
			'foo': function () { return 'foo'; },
			'subfoo': function () { return 'subfoo'; }
		});
		ebookr.parse('<foo>');
		expect(ebookr.parse('<subfoo>').render()).to.equal('subfoo');
	});

	it('should call renderer for each token', function () {
		var renderer = sinon.spy();
		ebookr.addRenderer('foo', renderer);
		ebookr.parse('<foo /> <foo /> <foo />').render();
		expect(renderer.calledThrice).to.be.true;
	});
});