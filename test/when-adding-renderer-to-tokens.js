var expect = require('chai').expect,
		ebookr = require('../src/ebookr');

describe('When adding renderer to tokens', function () {
	var bkr;

	beforeEach(function () {
		bkr = ebookr();
	});

	it('should be able to add renderer individually', function () {
		var fn = function () {};
		bkr.addRenderer('test', fn);
		expect(bkr.tokens.test).to.be.an('object');
		expect(bkr.tokens.test.renderer).to.equal(fn);
		expect(bkr.tokens.test.renderer.args).to.be.empty;
	});

	it('should be able to add renderers en masse', function () {
		var fn1 = function (foo) {},
				fn2 = function (foo, bar) {};
		bkr.addRenderers({'test1': fn1,'test2': fn2});
		expect(bkr.tokens.test1.renderer).to.equal(fn1);
		expect(bkr.tokens.test1.renderer.args).to.eql(['foo']);
		expect(bkr.tokens.test2.renderer).to.equal(fn2);
		expect(bkr.tokens.test2.renderer.args).to.eql(['foo', 'bar']);
	});
});