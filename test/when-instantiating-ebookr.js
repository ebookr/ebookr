var expect = require('chai').expect,
		ebookr = require('../src/ebookr');

describe('When instantiating ebookr', function () {
	it('should contain no tokens', function () {
		var bkr = ebookr();
		expect(bkr.tokens).to.be.empty;
	});

	it('should act like a singleton', function () {
		var bkr1 = ebookr(),
				bkr2 = ebookr(),
				fn = function () {};
		bkr1.addParser('test', fn);
		expect(bkr2.tokens).to.equal(bkr1.tokens);
	});
});