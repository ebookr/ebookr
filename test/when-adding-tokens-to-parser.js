var expect = require('chai').expect,
		parser = require('../src/parser');

describe('When adding tokens to parser', function () {
	var prsr;

	beforeEach(function () {
		prsr = parser();
	});

	it('should by default contain no tokens to parse for', function () {
		expect(Object.keys(prsr.tokens)).to.be.empty;
	});

	it('should be able to add tokens individually', function () {
		var fn = function () {};
		prsr.addToken('test', fn);
		expect(prsr.tokens.test).to.equal(fn);
		expect(prsr.tokens.test.args).to.be.empty;
	});

	it('should be able to add tokens en masse', function () {
		var fn1 = function (foo) {},
				fn2 = function (foo, bar) {};
		prsr.addTokens({'test1': fn1,'test2': fn2});
		expect(prsr.tokens.test1).to.equal(fn1);
		expect(prsr.tokens.test1.args).to.eql(['foo']);
		expect(prsr.tokens.test2).to.equal(fn2);
		expect(prsr.tokens.test2.args).to.eql(['foo', 'bar']);
	});
});