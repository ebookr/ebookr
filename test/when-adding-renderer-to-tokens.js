var expect = require('chai').expect;

describe('When adding renderer to tokens', function () {
	var ebookr;

	beforeEach(function () {
		ebookr = require('../lib/ebookr').new();
	});
	
	it('should be able to add renderer individually', function () {
		var fn = function () {};
		ebookr.addRenderer('test', fn);
		expect(ebookr.tokens.test).to.be.an('object');
		expect(ebookr.tokens.test.renderer).to.equal(fn);
		expect(ebookr.tokens.test.renderer.args).to.be.empty;
	});

	it('should be able to add renderers en masse', function () {
		var fn1 = function (foo) {},
				fn2 = function (foo, bar) {};
		ebookr.addRenderers({'test1': fn1,'test2': fn2});
		expect(ebookr.tokens.test1.renderer).to.equal(fn1);
		expect(ebookr.tokens.test1.renderer.args).to.eql(['foo']);
		expect(ebookr.tokens.test2.renderer).to.equal(fn2);
		expect(ebookr.tokens.test2.renderer.args).to.eql(['foo', 'bar']);
	});
});