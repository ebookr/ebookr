var expect = require('chai').expect;

describe('When adding parser to tokens', function () {
	var ebookr;

	beforeEach(function () {
		ebookr = require('../lib/ebookr').new();
	});
	
	it('should be able to add parsers individually', function () {
		var fn = function () {};
		ebookr.addParser('test', fn);
		expect(ebookr.tokens.test).to.be.an('object');
		expect(ebookr.tokens.test.args).to.be.empty;
		expect(ebookr.tokens.test.parser).to.equal(fn);
	});

	it('should be able to add tokens en masse', function () {
		var fn1 = function (foo) {},
				fn2 = function (foo, bar) {};
		ebookr.addParsers({'test1': fn1,'test2': fn2});
		expect(ebookr.tokens.test1.args).to.eql(['foo']);
		expect(ebookr.tokens.test1.parser).to.equal(fn1);
		expect(ebookr.tokens.test2.args).to.eql(['foo', 'bar']);
		expect(ebookr.tokens.test2.parser).to.equal(fn2);
	});
});