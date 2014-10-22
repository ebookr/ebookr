var expect = require('chai').expect,
		ebookr = require('../src/ebookr');

describe('When adding parser to tokens', function () {
	var bkr;

	beforeEach(function () {
		bkr = ebookr();
	});

	it('should be able to add parsers individually', function () {
		var fn = function () {};
		bkr.addParser('test', fn);
		expect(bkr.tokens.test).to.be.an('object');
		expect(bkr.tokens.test.parser).to.equal(fn);
		expect(bkr.tokens.test.parser.args).to.be.empty;
	});

	it('should be able to add tokens en masse', function () {
		var fn1 = function (foo) {},
				fn2 = function (foo, bar) {};
		bkr.addParsers({'test1': fn1,'test2': fn2});
		expect(bkr.tokens.test1.parser).to.equal(fn1);
		expect(bkr.tokens.test1.parser.args).to.eql(['foo']);
		expect(bkr.tokens.test2.parser).to.equal(fn2);
		expect(bkr.tokens.test2.parser.args).to.eql(['foo', 'bar']);
	});
});