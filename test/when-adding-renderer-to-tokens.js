var expect = require('chai').expect;

describe('When adding renderer to tokens', function () {
	var ebookr;

	beforeEach(function () {
		ebookr = require('../lib/ebookr').new();
	});
	
	it('should be able to add renderer individually', function () {
		var fn = function () {};
		ebookr.addRenderer('foo', fn);
		expect(ebookr.tokens.foo).to.be.an('object');
		expect(ebookr.tokens.foo.renderer).to.equal(fn);
		expect(ebookr.tokens.foo.end).not.to.exist;
	});

	it('should be able to add renderers en masse', function () {
		var fn1 = function (foo) {},
				fn2 = function (foo, bar) {};
		ebookr.addRenderers({
			'test1': fn1,
			'test2': [fn2, fn2]
		});
		expect(ebookr.tokens.test1.renderer).to.equal(fn1);
		expect(ebookr.tokens.test1.end).not.to.exist;
		expect(ebookr.tokens.test2.renderer).to.equal(fn2);
		expect(ebookr.tokens.test2.end).to.equal(fn2);
	});
});