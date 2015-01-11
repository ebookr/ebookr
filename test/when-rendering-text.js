var chai = require('chai'),
		expect = chai.expect,
		sinonChai = require('sinon-chai'),
		mockrequire = require('mockrequire'),
		sinon = require('sinon'),
		util = require('util');

chai.use(sinonChai);

describe('When rendering text', function () {
	var ebookr;
	var warnSpy;

	beforeEach(function () {
		warnSpy = sinon.spy();
		ebookr = mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./ebookr/parser': mockrequire('../lib/ebookr/parser', {
				'util': require('util'),
				'./util': { warn: warnSpy }
			})
		}).new();
		ebookr.addParser('foo', function (one, two, text) {
			return [one, two, text];
		});
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

	it('should render open tags', function () {
		ebookr.addRenderer('foo', function (one, two, text) {
			return util.format('{%s}', text);
		});
		expect(ebookr.parse('foo <foo>test</foo> bar').render()).to.equal('foo {test} bar');
	});

	it('should render nested open tags', function () {
		ebookr.addRenderer('foo', function (one, two, text) {
			return util.format('{%s}', text);
		});
		ebookr.addParser('bar', function (text) {
			return [text];
		});
		ebookr.addRenderer('bar', function (text) {
			return util.format('[%s]', text);
		});
		expect(ebookr.parse('<foo><bar>test</bar></foo>').render()).to.equal('{[test]}');
	});

	it('should parse closed tags', function () {
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

	it('should render multiple tags with different attributes', function () {
		var renderer = sinon.spy();
		ebookr.addRenderer('foo', renderer);
		ebookr.parse('<foo one="42" /> <foo one="666" />').render();
		expect(renderer.calledTwice).to.be.true;
		expect(renderer).to.have.been.calledWith('42', undefined);
		expect(renderer).to.have.been.calledWith('666', undefined);
	});
});